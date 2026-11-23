/* Generated from banking-core-api@fc06aebdc53ae2e4a28e54aaeb875294e317e8c1. Run npm run contract:generate to refresh. */
export interface paths {
    "/accounts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List the customer's deposit accounts
         * @description Requires the banking-core-api client role accounts:read and a mapped customer. Returns accounts in ascending account ID order. An empty page is a successful result.
         */
        get: operations["listAccounts"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/accounts/{accountId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read an owned deposit account
         * @description Requires the banking-core-api client role accounts:read and a mapped customer. Ownership is derived from the verified actor. A recipient reference grants no account read access.
         */
        get: operations["getAccount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transfers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Transfer PHP between two distinct active Tiwalo deposit accounts
         * @description The authenticated customer needs the transfers:create API client role and must own the source.
         *     The destination can belong to another
         *     customer and is addressed by its opaque recipient reference. The configured per-transfer
         *     cap and available source funds are checked before posting.
         *
         *     Use one Idempotency-Key for one intent. The scope is the authenticated actor and this
         *     operation. The logical request consists of the source account ID, recipient reference,
         *     currency and amount. JSON whitespace and property order have no effect on that identity.
         *     After authorization, the same key and logical request return the original 201 receipt and
         *     Location, or the original 422 decline, even if balances subsequently change. A changed
         *     logical request with the same key yields 409. Outcomes are retained for the lifetime of
         *     the simulated financial history.
         *
         *     Following response loss, timeout or 503, retry the identical request with the original key.
         *     If the transfer ID is already known, the initiating customer can also read its receipt.
         *     A new key expresses a new payment intent.
         */
        post: operations["createInternalTransfer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/transfers/{transferId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Read the initiating customer's posted transfer receipt
         * @description The initiating customer needs the transfers:read API client role and ownership of the source. The transfer ID identifies the same committed result returned by transfer creation.
         */
        get: operations["getTransferReceipt"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/operations/reconciliations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Capture an immutable reconciliation report
         * @description Requires a mapped operator and the operations:investigate role. Each empty POST starts a separate synchronous scan of one committed PostgreSQL snapshot. A zero count means all checks passed.
         */
        post: operations["runReconciliation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/operations/reconciliations/{runId}/findings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Investigate a saved reconciliation report
         * @description Requires a mapped operator and the operations:investigate role. Each lookup is audited. Findings use ascending opaque reference order and preserve the evidence observed during the run.
         */
        get: operations["listReconciliationFindings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        ReconciliationRun: {
            runId: components["schemas"]["Id"];
            /** Format: date-time */
            startedAt: string;
            /** Format: int64 */
            findingCount: number;
        };
        /** @description Opaque reference stable across runs for the same check, subject and currency. */
        FindingReference: string;
        /** @description Exact centavos from a diagnostic calculation. Inconsistent data can produce negative or out-of-BIGINT totals. */
        EvidenceMinor: string;
        /** @description Balance findings include the recomputed balance and any existing projection. Journal imbalance includes both per-currency totals. Link findings carry only a reference and code. */
        ReconciliationFinding: {
            reference: components["schemas"]["FindingReference"];
            /** @enum {string} */
            code: "MISSING_PROJECTION" | "BALANCE_MISMATCH" | "JOURNAL_IMBALANCE" | "TRANSFER_JOURNAL_MISMATCH" | "JOURNAL_WITHOUT_TRANSFER" | "MISSING_POSTING_AUDIT" | "POSTING_AUDIT_MISMATCH" | "AUDIT_WITHOUT_JOURNAL";
            currency?: components["schemas"]["Currency"];
            computedBalanceMinor?: components["schemas"]["EvidenceMinor"];
            projectedBalanceMinor?: components["schemas"]["EvidenceMinor"];
            debitTotalMinor?: components["schemas"]["EvidenceMinor"];
            creditTotalMinor?: components["schemas"]["EvidenceMinor"];
        };
        /** Format: uuid */
        Id: string;
        /** @description Opaque, case-sensitive payment address. Clients preserve it verbatim. */
        RecipientReference: string;
        Cursor: string;
        /** @enum {string} */
        Currency: "PHP";
        /** @description Nonnegative centavos up to 9223372036854775807 inclusive. */
        MinorUnits: string;
        /** @description Positive centavos up to 9223372036854775807 inclusive. Out-of-range values are invalid requests. */
        TransferAmountMinor: components["schemas"]["MinorUnits"] & string;
        Account: {
            accountId: components["schemas"]["Id"];
            recipientReference: components["schemas"]["RecipientReference"];
            /** @enum {string} */
            status: "ACTIVE" | "FROZEN" | "CLOSED";
            currency: components["schemas"]["Currency"];
            availableBalanceMinor: components["schemas"]["MinorUnits"];
        };
        TransferRequest: {
            sourceAccountId: components["schemas"]["Id"];
            recipientReference: components["schemas"]["RecipientReference"];
            currency: components["schemas"]["Currency"];
            amountMinor: components["schemas"]["TransferAmountMinor"];
        };
        TransferReceipt: {
            transferId: components["schemas"]["Id"];
            sourceAccountId: components["schemas"]["Id"];
            recipientReference: components["schemas"]["RecipientReference"];
            currency: components["schemas"]["Currency"];
            amountMinor: components["schemas"]["TransferAmountMinor"];
            /** @enum {string} */
            status: "POSTED";
            /** Format: date-time */
            postedAt: string;
        };
        /** @description RFC 9457 Problem Details. Branch on the stable code. User-facing text may change. */
        Problem: {
            /** Format: uri */
            type: string;
            title: string;
            status: number;
            code: string;
            detail?: string;
            /** Format: uri-reference */
            instance?: string;
        };
    };
    responses: {
        /** @description Report creation or audited access failed. */
        ReconciliationFailure: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "type": "urn:tiwalo:problem:internal-error",
                 *       "title": "Reconciliation service error",
                 *       "status": 500,
                 *       "code": "INTERNAL_ERROR"
                 *     }
                 */
                "application/problem+json": components["schemas"]["Problem"];
            };
        };
        /** @description Invalid input such as a malformed ID, invalid cursor, missing key or out-of-range amount. */
        InvalidRequest: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "type": "urn:tiwalo:problem:invalid-request",
                 *       "title": "Invalid request",
                 *       "status": 400,
                 *       "code": "INVALID_REQUEST"
                 *     }
                 */
                "application/problem+json": components["schemas"]["Problem"] & {
                    /** @constant */
                    status?: 400;
                    /** @constant */
                    code?: "INVALID_REQUEST";
                };
            };
        };
        /** @description A valid access token for the configured issuer and audience is required. */
        Unauthorized: {
            headers: {
                /** @example Bearer */
                "WWW-Authenticate": string;
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "type": "urn:tiwalo:problem:unauthorized",
                 *       "title": "Authentication required",
                 *       "status": 401,
                 *       "code": "UNAUTHORIZED"
                 *     }
                 */
                "application/problem+json": components["schemas"]["Problem"] & {
                    /** @constant */
                    status?: 401;
                    /** @constant */
                    code?: "UNAUTHORIZED";
                };
            };
        };
        /** @description The verified actor lacks permission for the operation. */
        Forbidden: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "type": "urn:tiwalo:problem:forbidden",
                 *       "title": "Permission denied",
                 *       "status": 403,
                 *       "code": "FORBIDDEN"
                 *     }
                 */
                "application/problem+json": components["schemas"]["Problem"] & {
                    /** @constant */
                    status?: 403;
                    /** @constant */
                    code?: "FORBIDDEN";
                };
            };
        };
        /** @description The resource is absent or outside the authenticated customer's ownership. Both return the same problem. */
        NotFound: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                /**
                 * @example {
                 *       "type": "urn:tiwalo:problem:not-found",
                 *       "title": "Resource not found",
                 *       "status": 404,
                 *       "code": "NOT_FOUND"
                 *     }
                 */
                "application/problem+json": components["schemas"]["Problem"] & {
                    /** @constant */
                    status?: 404;
                    /** @constant */
                    code?: "NOT_FOUND";
                };
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listAccounts: {
        parameters: {
            query?: {
                /** @description Maximum number of accounts in the page. */
                limit?: number;
                /** @description Use the nextCursor from the previous page. Cursors are scoped to the authenticated customer. */
                cursor?: components["schemas"]["Cursor"];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A page of owned deposit accounts. The final page omits nextCursor. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "accounts": []
                     *     }
                     */
                    "application/json": {
                        accounts: components["schemas"]["Account"][];
                        nextCursor?: components["schemas"]["Cursor"];
                    };
                };
            };
            400: components["responses"]["InvalidRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
        };
    };
    getAccount: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                accountId: components["schemas"]["Id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The customer's account and available balance. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "accountId": "00000000-0000-4000-8000-000000000001",
                     *       "recipientReference": "rcp_demo_alder",
                     *       "status": "ACTIVE",
                     *       "currency": "PHP",
                     *       "availableBalanceMinor": "9007199254740993"
                     *     }
                     */
                    "application/json": components["schemas"]["Account"];
                };
            };
            400: components["responses"]["InvalidRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["NotFound"];
        };
    };
    createInternalTransfer: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description Opaque, case-sensitive client-generated key. Independent operations and actors have separate key spaces.
                 * @example demo-internal-payment-001
                 */
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "sourceAccountId": "00000000-0000-4000-8000-000000000001",
                 *       "recipientReference": "rcp_demo_birch",
                 *       "currency": "PHP",
                 *       "amountMinor": "500000"
                 *     }
                 */
                "application/json": components["schemas"]["TransferRequest"];
            };
        };
        responses: {
            /** @description Posted transfer. A replay of this success returns the same status, receipt, and Location. */
            201: {
                headers: {
                    /**
                     * @description Path to the initiating customer's receipt.
                     * @example /api/v1/transfers/00000000-0000-4000-8000-000000000002
                     */
                    Location: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransferReceipt"];
                };
            };
            400: components["responses"]["InvalidRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["NotFound"];
            /** @description This actor already used the key for a different logical transfer request. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "type": "urn:tiwalo:problem:idempotency-conflict",
                     *       "title": "Idempotency key conflict",
                     *       "status": 409,
                     *       "code": "IDEMPOTENCY_CONFLICT"
                     *     }
                     */
                    "application/problem+json": components["schemas"]["Problem"] & {
                        /** @constant */
                        status?: 409;
                        /** @constant */
                        code?: "IDEMPOTENCY_CONFLICT";
                    };
                };
            };
            /**
             * @description Definite business decline with no financial posting. The original decline replays
             *     under the same key. Codes are INSUFFICIENT_FUNDS, TRANSFER_LIMIT_EXCEEDED,
             *     SAME_ACCOUNT and ACCOUNT_UNAVAILABLE. The last covers ineligible accounts and
             *     unresolvable recipient references without exposing recipient details.
             */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/problem+json": components["schemas"]["Problem"] & {
                        /** @constant */
                        status?: 422;
                        /** @enum {unknown} */
                        code?: "INSUFFICIENT_FUNDS" | "TRANSFER_LIMIT_EXCEEDED" | "SAME_ACCOUNT" | "ACCOUNT_UNAVAILABLE";
                    };
                };
            };
            /** @description Bounded wait or transient contention. Resolve the original intent by retrying with the same key. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "type": "urn:tiwalo:problem:transfer-busy",
                     *       "title": "Transfer temporarily unavailable",
                     *       "status": 503,
                     *       "code": "TRANSFER_BUSY"
                     *     }
                     */
                    "application/problem+json": components["schemas"]["Problem"] & {
                        /** @constant */
                        status?: 503;
                        /** @constant */
                        code?: "TRANSFER_BUSY";
                    };
                };
            };
        };
    };
    getTransferReceipt: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                transferId: components["schemas"]["Id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The original posted receipt. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TransferReceipt"];
                };
            };
            400: components["responses"]["InvalidRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["NotFound"];
        };
    };
    runReconciliation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The report and operator audit committed. Location points to the report's findings. */
            201: {
                headers: {
                    /** @description Findings page for this run. */
                    Location: string;
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "runId": "fe263158-be15-4d06-844a-e6ffe1f07d6b",
                     *       "startedAt": "2026-11-19T04:23:10Z",
                     *       "findingCount": 0
                     *     }
                     */
                    "application/json": components["schemas"]["ReconciliationRun"];
                };
            };
            400: components["responses"]["InvalidRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
            500: components["responses"]["ReconciliationFailure"];
        };
    };
    listReconciliationFindings: {
        parameters: {
            query?: {
                limit?: number;
                /** @description An exclusive finding reference from this report. Use nextCursor to continue. */
                cursor?: components["schemas"]["FindingReference"];
            };
            header?: never;
            path: {
                runId: components["schemas"]["Id"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description A bounded page. The final page omits nextCursor. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "runId": "fe263158-be15-4d06-844a-e6ffe1f07d6b",
                     *       "findings": [
                     *         {
                     *           "reference": "931e1c4efd4082c1a4743256d87f540f26742c39a441e40877eb3766ce34468b",
                     *           "code": "BALANCE_MISMATCH",
                     *           "currency": "PHP",
                     *           "computedBalanceMinor": "1500",
                     *           "projectedBalanceMinor": "1200"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        runId: components["schemas"]["Id"];
                        findings: components["schemas"]["ReconciliationFinding"][];
                        nextCursor?: components["schemas"]["FindingReference"];
                    };
                };
            };
            400: components["responses"]["InvalidRequest"];
            401: components["responses"]["Unauthorized"];
            403: components["responses"]["Forbidden"];
            404: components["responses"]["NotFound"];
            500: components["responses"]["ReconciliationFailure"];
        };
    };
}
