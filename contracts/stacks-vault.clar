;; StacksVault — Decentralized Micro-Savings & Goals Platform
;; A Clarity smart contract for managing personal savings goals on Stacks
;; Users can create savings vaults with target amounts and deadlines,
;; deposit STX, track progress, and withdraw upon goal completion.

;; ============================================================
;; Constants
;; ============================================================

;; Contract deployer / admin
(define-constant CONTRACT_OWNER tx-sender)

;; Error codes
(define-constant ERR_NOT_AUTHORIZED (err u100))
(define-constant ERR_VAULT_EXISTS (err u101))
(define-constant ERR_VAULT_NOT_FOUND (err u102))
(define-constant ERR_INVALID_AMOUNT (err u103))
(define-constant ERR_DEADLINE_PASSED (err u104))
(define-constant ERR_GOAL_NOT_REACHED (err u105))
(define-constant ERR_VAULT_LOCKED (err u106))
(define-constant ERR_ALREADY_WITHDRAWN (err u107))
(define-constant ERR_INVALID_DEADLINE (err u108))
(define-constant ERR_ZERO_DEPOSIT (err u109))
(define-constant ERR_VAULT_LIMIT_REACHED (err u110))

;; Maximum vaults per user
(define-constant MAX_VAULTS_PER_USER u10)

;; Minimum deposit amount (1 STX = 1,000,000 micro-STX)
(define-constant MIN_DEPOSIT u1000000)

;; ============================================================
;; Data Variables (Global State)
;; ============================================================

;; Total number of vaults created across all users
(define-data-var total-vaults uint u0)

;; Total STX locked across all vaults (in micro-STX)
(define-data-var total-locked uint u0)

;; Total number of completed goals
(define-data-var total-goals-completed uint u0)

;; Total unique depositors
(define-data-var total-users uint u0)

;; ============================================================
;; Data Maps (Per-User & Per-Vault State)
;; ============================================================

;; Core vault data: stores each user's vault by index
(define-map vaults
  { owner: principal, vault-id: uint }
  {
    name: (string-ascii 50),       ;; Human-readable vault name
    target-amount: uint,            ;; Goal amount in micro-STX
    current-amount: uint,           ;; Amount deposited so far
    deadline: uint,                 ;; Block height deadline
    created-at: uint,               ;; Block height when created
    is-completed: bool,             ;; Whether goal was reached
    is-withdrawn: bool,             ;; Whether funds have been withdrawn
    total-deposits: uint            ;; Number of deposit transactions
  }
)

;; Tracks the number of vaults each user has created
(define-map user-vault-count principal uint)

;; Tracks whether a user has been counted as a unique user
(define-map user-registered principal bool)

;; Deposit history — stores last deposit info per vault
(define-map deposit-history
  { owner: principal, vault-id: uint }
  {
    last-deposit-amount: uint,
    last-deposit-block: uint
  }
)

;; ============================================================
;; Read-Only Functions (Getters)
;; ============================================================

;; Get vault details for a specific user and vault ID
(define-read-only (get-vault (owner principal) (vault-id uint))
  (map-get? vaults { owner: owner, vault-id: vault-id })
)

;; Get the number of vaults a user has created
(define-read-only (get-user-vault-count (user principal))
  (default-to u0 (map-get? user-vault-count user))
)

;; Get platform-wide statistics
(define-read-only (get-platform-stats)
  (ok {
    total-vaults: (var-get total-vaults),
    total-locked: (var-get total-locked),
    total-goals-completed: (var-get total-goals-completed),
    total-users: (var-get total-users)
  })
)

;; Get deposit history for a vault
(define-read-only (get-deposit-history (owner principal) (vault-id uint))
  (map-get? deposit-history { owner: owner, vault-id: vault-id })
)

;; Calculate progress percentage (returns 0–100)
(define-read-only (get-vault-progress (owner principal) (vault-id uint))
  (match (map-get? vaults { owner: owner, vault-id: vault-id })
    vault (ok (/ (* (get current-amount vault) u100) (get target-amount vault)))
    ERR_VAULT_NOT_FOUND
  )
)

;; Check if a vault's deadline has passed
(define-read-only (is-deadline-passed (owner principal) (vault-id uint))
  (match (map-get? vaults { owner: owner, vault-id: vault-id })
    vault (ok (>= block-height (get deadline vault)))
    ERR_VAULT_NOT_FOUND
  )
)

;; ============================================================
;; Public Functions (Write Operations)
;; ============================================================

;; Create a new savings vault
;; @param name: Human-readable name for the vault (max 50 chars)
;; @param target-amount: Goal amount in micro-STX
;; @param deadline: Block height by which the goal should be reached
(define-public (create-vault (name (string-ascii 50)) (target-amount uint) (deadline uint))
  (let
    (
      (sender tx-sender)
      (current-count (get-user-vault-count sender))
      (new-vault-id current-count)
    )
    ;; Validate inputs
    (asserts! (< current-count MAX_VAULTS_PER_USER) ERR_VAULT_LIMIT_REACHED)
    (asserts! (> target-amount u0) ERR_INVALID_AMOUNT)
    (asserts! (> deadline block-height) ERR_INVALID_DEADLINE)

    ;; Register user if first vault
    (if (is-none (map-get? user-registered sender))
      (begin
        (map-set user-registered sender true)
        (var-set total-users (+ (var-get total-users) u1))
      )
      true
    )

    ;; Create the vault
    (map-set vaults
      { owner: sender, vault-id: new-vault-id }
      {
        name: name,
        target-amount: target-amount,
        current-amount: u0,
        deadline: deadline,
        created-at: block-height,
        is-completed: false,
        is-withdrawn: false,
        total-deposits: u0
      }
    )

    ;; Update user vault count
    (map-set user-vault-count sender (+ current-count u1))

    ;; Update global vault count
    (var-set total-vaults (+ (var-get total-vaults) u1))

    ;; Return the new vault ID
    (ok new-vault-id)
  )
)

;; Deposit STX into a specific vault
;; @param vault-id: The vault index to deposit into
;; @param amount: Amount of micro-STX to deposit
(define-public (deposit (vault-id uint) (amount uint))
  (let
    (
      (sender tx-sender)
      (vault (unwrap! (map-get? vaults { owner: sender, vault-id: vault-id }) ERR_VAULT_NOT_FOUND))
      (current-amount (get current-amount vault))
      (target-amount (get target-amount vault))
      (new-amount (+ current-amount amount))
    )
    ;; Validate deposit
    (asserts! (>= amount MIN_DEPOSIT) ERR_ZERO_DEPOSIT)
    (asserts! (not (get is-withdrawn vault)) ERR_ALREADY_WITHDRAWN)
    (asserts! (< block-height (get deadline vault)) ERR_DEADLINE_PASSED)

    ;; Transfer STX from user to contract
    (try! (stx-transfer? amount sender (as-contract tx-sender)))

    ;; Check if goal is now reached
    (let
      (
        (goal-reached (>= new-amount target-amount))
      )
      ;; Update the vault
      (map-set vaults
        { owner: sender, vault-id: vault-id }
        (merge vault {
          current-amount: new-amount,
          is-completed: goal-reached,
          total-deposits: (+ (get total-deposits vault) u1)
        })
      )

      ;; Update deposit history
      (map-set deposit-history
        { owner: sender, vault-id: vault-id }
        {
          last-deposit-amount: amount,
          last-deposit-block: block-height
        }
      )

      ;; Update global locked amount
      (var-set total-locked (+ (var-get total-locked) amount))

      ;; Update completed goals count if just completed
      (if goal-reached
        (var-set total-goals-completed (+ (var-get total-goals-completed) u1))
        true
      )

      (ok {
        new-balance: new-amount,
        goal-reached: goal-reached
      })
    )
  )
)

;; Withdraw funds from a completed vault
;; @param vault-id: The vault index to withdraw from
(define-public (withdraw (vault-id uint))
  (let
    (
      (sender tx-sender)
      (vault (unwrap! (map-get? vaults { owner: sender, vault-id: vault-id }) ERR_VAULT_NOT_FOUND))
      (amount (get current-amount vault))
    )
    ;; Validate withdrawal
    (asserts! (not (get is-withdrawn vault)) ERR_ALREADY_WITHDRAWN)
    (asserts! (get is-completed vault) ERR_GOAL_NOT_REACHED)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)

    ;; Transfer STX from contract back to user
    (try! (as-contract (stx-transfer? amount tx-sender sender)))

    ;; Mark vault as withdrawn
    (map-set vaults
      { owner: sender, vault-id: vault-id }
      (merge vault {
        is-withdrawn: true
      })
    )

    ;; Update global locked amount
    (var-set total-locked (- (var-get total-locked) amount))

    (ok amount)
  )
)

;; Emergency withdraw — allows withdrawal after deadline even if goal not reached
;; This ensures users never lose access to their funds
;; @param vault-id: The vault index for emergency withdrawal
(define-public (emergency-withdraw (vault-id uint))
  (let
    (
      (sender tx-sender)
      (vault (unwrap! (map-get? vaults { owner: sender, vault-id: vault-id }) ERR_VAULT_NOT_FOUND))
      (amount (get current-amount vault))
    )
    ;; Validate emergency withdrawal
    (asserts! (not (get is-withdrawn vault)) ERR_ALREADY_WITHDRAWN)
    (asserts! (>= block-height (get deadline vault)) ERR_VAULT_LOCKED)
    (asserts! (> amount u0) ERR_INVALID_AMOUNT)

    ;; Transfer STX from contract back to user
    (try! (as-contract (stx-transfer? amount tx-sender sender)))

    ;; Mark vault as withdrawn
    (map-set vaults
      { owner: sender, vault-id: vault-id }
      (merge vault {
        is-withdrawn: true
      })
    )

    ;; Update global locked amount
    (var-set total-locked (- (var-get total-locked) amount))

    (ok amount)
  )
)
