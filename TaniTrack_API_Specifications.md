# ============================================================================
# TaniTrack: Hatchery Management System
# REST API Endpoint Specifications v1.0
# Created: December 2024
# Company: Tani Nigeria Ltd
# ============================================================================

## BASE URL
**Production:** `https://api.tanitrack.com/v1`
**Development:** `http://localhost:3000/api/v1`

## AUTHENTICATION
All endpoints (except `/auth/login` and `/auth/register`) require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

Token expiration: 24 hours
Refresh token expiration: 7 days

## RESPONSE FORMAT
All responses follow this structure:
```json
{
  "success": true/false,
  "message": "Human-readable message",
  "data": { ... } or [ ... ],
  "error": { "code": "ERROR_CODE", "details": "..." } // Only if success=false
}
```

## HTTP STATUS CODES
- `200 OK` - Successful GET, PUT, PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate resource
- `500 Internal Server Error` - Server error

## ERROR CODES
- `AUTH_001` - Invalid credentials
- `AUTH_002` - Token expired
- `AUTH_003` - Insufficient permissions
- `VAL_001` - Validation error
- `RES_001` - Resource not found
- `RES_002` - Resource already exists
- `DB_001` - Database error

---

# ============================================================================
# 1. AUTHENTICATION & USER MANAGEMENT
# ============================================================================

## 1.1 Login
**POST** `/auth/login`

**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "phone_number": "08012345678",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 1,
      "username": "admin",
      "full_name": "System Administrator",
      "phone_number": "08012345678",
      "role": {
        "role_id": 1,
        "role_name": "owner"
      }
    },
    "tokens": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expires_in": 86400
    }
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid phone number or password",
  "error": {
    "code": "AUTH_001",
    "details": "Authentication failed"
  }
}
```

---

## 1.2 Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86400
  }
}
```

---

## 1.3 Logout
**POST** `/auth/logout`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 1.4 Get Current User
**GET** `/auth/me`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user_id": 1,
    "username": "admin",
    "full_name": "System Administrator",
    "phone_number": "08012345678",
    "role": {
      "role_id": 1,
      "role_name": "owner",
      "description": "Full system access"
    },
    "last_login": "2024-12-01T08:30:00Z"
  }
}
```

---

## 1.5 List Users
**GET** `/users`

**Query Parameters:**
- `role` (optional) - Filter by role name
- `is_active` (optional) - Filter by active status (true/false)
- `page` (default: 1)
- `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "user_id": 1,
        "username": "admin",
        "full_name": "System Administrator",
        "phone_number": "08012345678",
        "role": "owner",
        "is_active": true,
        "last_login": "2024-12-01T08:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "total_pages": 1
    }
  }
}
```

---

## 1.6 Create User
**POST** `/users`

**Permission:** owner, manager only

**Request Body:**
```json
{
  "username": "john_doe",
  "phone_number": "08098765432",
  "password": "secure123",
  "full_name": "John Doe",
  "role_id": 3
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user_id": 2,
    "username": "john_doe",
    "full_name": "John Doe",
    "phone_number": "08098765432",
    "role": "senior_assistant"
  }
}
```

---

## 1.7 Update User
**PUT** `/users/:user_id`

**Request Body:**
```json
{
  "full_name": "John Doe Updated",
  "phone_number": "08098765432",
  "role_id": 4,
  "is_active": true
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user_id": 2,
    "username": "john_doe",
    "full_name": "John Doe Updated",
    "phone_number": "08098765432",
    "role": "junior_assistant",
    "is_active": true
  }
}
```

---

## 1.8 Delete User
**DELETE** `/users/:user_id`

**Permission:** owner only

**Response (204):** No content

---

# ============================================================================
# 2. DASHBOARD
# ============================================================================

## 2.1 Get Dashboard Summary
**GET** `/dashboard/summary`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "active_batches": 12,
    "total_fish": 145000,
    "spawns_this_week": 3,
    "sales_this_week": 2850000,
    "expenses_this_month": 1245000,
    "low_stock_items": 2,
    "active_health_issues": 1,
    "tank_utilization": {
      "total_tanks": 24,
      "occupied": 18,
      "empty": 6,
      "utilization_percent": 75
    }
  }
}
```

---

## 2.2 Get Today's Tasks
**GET** `/dashboard/tasks`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "spawning_scheduled": [
      {
        "spawn_id": 45,
        "spawn_code": "SP-2024-045",
        "scheduled_time": "2024-12-01T20:00:00Z",
        "status": "Planned"
      }
    ],
    "tanks_to_sample": [
      {
        "tank_id": 5,
        "tank_code": "TOP-1",
        "batch_code": "BATCH-2024-023",
        "days_since_last_sample": 7
      }
    ],
    "deliveries_due": [
      {
        "sale_id": 156,
        "customer_name": "Alhaji Musa",
        "quantity": 5000,
        "delivery_date": "2024-12-01"
      }
    ],
    "feed_to_reorder": [
      {
        "feed_name": "2.0mm Pellets",
        "current_stock_kg": 45,
        "reorder_level_kg": 100
      }
    ]
  }
}
```

---

## 2.3 Get Quick Stats
**GET** `/dashboard/quick-stats`

**Query Parameters:**
- `period` (optional) - 'week', 'month', 'year' (default: 'month')

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "production": {
      "total_spawns": 12,
      "total_eggs": 1200000,
      "avg_fertilization_rate": 78.5,
      "avg_hatch_rate": 62.3,
      "avg_survival_to_sale": 31.2
    },
    "sales": {
      "total_revenue": 8450000,
      "total_quantity": 95000,
      "avg_price_10g": 48,
      "avg_price_30g": 95
    },
    "financials": {
      "total_expenses": 3120000,
      "gross_profit": 5330000,
      "profit_margin": 63.1
    }
  }
}
```

---

# ============================================================================
# 3. SPAWNING MANAGEMENT
# ============================================================================

## 3.1 List Spawns
**GET** `/spawns`

**Query Parameters:**
- `status` (optional) - Filter by status
- `date_from` (optional) - ISO date
- `date_to` (optional) - ISO date
- `sort` (default: 'spawn_date') - Sort field
- `order` (default: 'desc') - 'asc' or 'desc'
- `page` (default: 1)
- `limit` (default: 20)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "spawns": [
      {
        "spawn_id": 45,
        "spawn_code": "SP-2024-045",
        "spawn_date": "2024-11-20",
        "injection_time": "2024-11-20T20:00:00Z",
        "females": [
          {"broodstock_code": "BF-001", "weight_kg": 1.2},
          {"broodstock_code": "BF-002", "weight_kg": 1.1}
        ],
        "males": [
          {"broodstock_code": "BM-001"},
          {"broodstock_code": "BM-002"}
        ],
        "estimated_egg_count": 100000,
        "fertilization_rate": 78.5,
        "hatch_rate": 65.2,
        "swim_up_count": 70000,
        "status": "Swim-up",
        "days_since_spawn": 11
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "total_pages": 3
    }
  }
}
```

---

## 3.2 Get Single Spawn
**GET** `/spawns/:spawn_id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "spawn_id": 45,
    "spawn_code": "SP-2024-045",
    "spawn_date": "2024-11-20",
    "injection_time": "2024-11-20T20:00:00Z",
    "hormone_type": "Ovaprim",
    "hormone_dose_ml": 1.15,
    "dose_per_kg": 0.5,
    "females": [
      {
        "broodstock_id": 1,
        "broodstock_code": "BF-001",
        "weight_kg": 1.2
      },
      {
        "broodstock_id": 2,
        "broodstock_code": "BF-002",
        "weight_kg": 1.1
      }
    ],
    "males": [
      {
        "broodstock_id": 4,
        "broodstock_code": "BM-001"
      },
      {
        "broodstock_id": 5,
        "broodstock_code": "BM-002"
      }
    ],
    "stripping_time": "2024-11-21T06:00:00Z",
    "estimated_egg_count": 100000,
    "fertilization_rate": 78.5,
    "hatch_rate": 65.2,
    "initial_fry_count": 78500,
    "swim_up_date": "2024-11-24T10:00:00Z",
    "swim_up_count": 70000,
    "hormone_cost_ngn": 3500,
    "status": "Swim-up",
    "updates": [
      {
        "update_type": "injection",
        "update_time": "2024-11-20T20:00:00Z",
        "notes": "Injected both females, placed in separate tanks"
      },
      {
        "update_type": "stripping",
        "update_time": "2024-11-21T06:00:00Z",
        "count_value": 100000,
        "notes": "Good ovulation, eggs stripped successfully"
      },
      {
        "update_type": "hatch",
        "update_time": "2024-11-22T14:00:00Z",
        "count_value": 78500,
        "rate_value": 78.5,
        "notes": "Hatching completed, larvae attached to walls"
      },
      {
        "update_type": "swim-up",
        "update_time": "2024-11-24T10:00:00Z",
        "count_value": 70000,
        "notes": "Fry swimming freely, started Artemia feeding"
      }
    ],
    "linked_batch": {
      "batch_id": 45,
      "batch_code": "BATCH-2024-045"
    },
    "created_at": "2024-11-20T15:00:00Z",
    "created_by": "admin"
  }
}
```

---

## 3.3 Create Spawn
**POST** `/spawns`

**Request Body:**
```json
{
  "spawn_date": "2024-12-01",
  "injection_time": "2024-12-01T20:00:00Z",
  "hormone_type": "Ovaprim",
  "hormone_dose_ml": 1.15,
  "dose_per_kg": 0.5,
  "female1_id": 1,
  "female1_weight_kg": 1.2,
  "female2_id": 2,
  "female2_weight_kg": 1.1,
  "male1_id": 4,
  "male2_id": 5,
  "estimated_egg_count": 100000,
  "hormone_cost_ngn": 3500,
  "notes": "Good broodstock condition, weather favorable"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Spawn record created successfully",
  "data": {
    "spawn_id": 46,
    "spawn_code": "SP-2024-046",
    "spawn_date": "2024-12-01",
    "status": "Planned",
    "expected_stripping_time": "2024-12-02T06:00:00Z"
  }
}
```

---

## 3.4 Update Spawn
**PUT** `/spawns/:spawn_id`

**Request Body:**
```json
{
  "stripping_time": "2024-12-02T06:00:00Z",
  "fertilization_rate": 82.5,
  "hatch_rate": 68.3,
  "initial_fry_count": 82500,
  "swim_up_date": "2024-12-05T10:00:00Z",
  "swim_up_count": 75000,
  "status": "Swim-up",
  "notes": "Excellent hatch rate, healthy fry"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Spawn updated successfully",
  "data": {
    "spawn_id": 46,
    "spawn_code": "SP-2024-046",
    "status": "Swim-up"
  }
}
```

---

## 3.5 Add Spawn Update
**POST** `/spawns/:spawn_id/updates`

**Request Body:**
```json
{
  "update_type": "hatch",
  "update_time": "2024-12-03T14:00:00Z",
  "count_value": 82500,
  "rate_value": 82.5,
  "notes": "Good hatching observed, removed dead eggs",
  "photo_url": "https://storage.tanitrack.com/spawns/46/hatch.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Spawn update added successfully",
  "data": {
    "update_id": 234,
    "spawn_id": 46,
    "update_type": "hatch"
  }
}
```

---

## 3.6 Delete Spawn
**DELETE** `/spawns/:spawn_id`

**Permission:** owner, manager only

**Response (204):** No content

---

# ============================================================================
# 4. BROODSTOCK MANAGEMENT
# ============================================================================

## 4.1 List Broodstock
**GET** `/broodstock`

**Query Parameters:**
- `sex` (optional) - 'Male' or 'Female'
- `health_status` (optional) - 'Active', 'Recovering', 'Retired', 'Deceased'
- `sort` (default: 'broodstock_code')
- `order` (default: 'asc')

**Response (200):**
```json
{
  "success": true,
  "data": {
    "broodstock": [
      {
        "broodstock_id": 1,
        "broodstock_code": "BF-001",
        "sex": "Female",
        "current_weight_kg": 1.2,
        "age_months": 18,
        "total_spawns": 12,
        "successful_spawns": 10,
        "avg_egg_count": 52000,
        "avg_fertilization_rate": 76.5,
        "last_spawn_date": "2024-11-15",
        "health_status": "Active",
        "acquisition_date": "2024-01-15"
      }
    ]
  }
}
```

---

## 4.2 Get Single Broodstock
**GET** `/broodstock/:broodstock_id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "broodstock_id": 1,
    "broodstock_code": "BF-001",
    "sex": "Female",
    "acquisition_date": "2024-01-15",
    "source": "Purchased",
    "initial_weight_kg": 0.8,
    "current_weight_kg": 1.2,
    "age_months": 18,
    "total_spawns": 12,
    "successful_spawns": 10,
    "last_spawn_date": "2024-11-15",
    "avg_egg_count": 52000,
    "avg_fertilization_rate": 76.5,
    "health_status": "Active",
    "notes": "Excellent performer, consistent spawner",
    "photo_url": "https://storage.tanitrack.com/broodstock/1.jpg",
    "spawn_history": [
      {
        "spawn_id": 45,
        "spawn_code": "SP-2024-045",
        "spawn_date": "2024-11-15",
        "egg_count": 60000,
        "fertilization_rate": 78.5,
        "success": true
      },
      {
        "spawn_id": 42,
        "spawn_code": "SP-2024-042",
        "spawn_date": "2024-11-05",
        "egg_count": 55000,
        "fertilization_rate": 82.0,
        "success": true
      }
    ],
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

---

## 4.3 Create Broodstock
**POST** `/broodstock`

**Request Body:**
```json
{
  "broodstock_code": "BF-007",
  "sex": "Female",
  "acquisition_date": "2024-12-01",
  "source": "Purchased",
  "initial_weight_kg": 0.9,
  "current_weight_kg": 0.9,
  "age_months": 12,
  "notes": "Newly acquired from Lagos supplier",
  "photo_url": "https://storage.tanitrack.com/broodstock/7.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Broodstock added successfully",
  "data": {
    "broodstock_id": 7,
    "broodstock_code": "BF-007",
    "sex": "Female",
    "health_status": "Active"
  }
}
```

---

## 4.4 Update Broodstock
**PUT** `/broodstock/:broodstock_id`

**Request Body:**
```json
{
  "current_weight_kg": 1.3,
  "health_status": "Active",
  "notes": "Weight gain good, ready for next spawn"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Broodstock updated successfully",
  "data": {
    "broodstock_id": 1,
    "broodstock_code": "BF-001",
    "current_weight_kg": 1.3
  }
}
```

---

## 4.5 Retire Broodstock
**POST** `/broodstock/:broodstock_id/retire`

**Request Body:**
```json
{
  "retirement_date": "2024-12-01",
  "reason": "Age, declining performance",
  "notes": "Served well for 18 months, 12 total spawns"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Broodstock retired successfully",
  "data": {
    "broodstock_id": 1,
    "broodstock_code": "BF-001",
    "health_status": "Retired",
    "retirement_date": "2024-12-01"
  }
}
```

---

## 4.6 Get Performance Stats
**GET** `/broodstock/stats`

**Query Parameters:**
- `sex` (optional)
- `period` (optional) - 'month', 'quarter', 'year'

**Response (200):**
```json
{
  "success": true,
  "data": {
    "total_active": 15,
    "females_active": 10,
    "males_active": 5,
    "avg_spawns_per_female": 8.5,
    "avg_fertilization_rate": 77.8,
    "top_performers": [
      {
        "broodstock_code": "BF-003",
        "total_spawns": 15,
        "avg_fertilization_rate": 85.2,
        "avg_egg_count": 58000
      }
    ]
  }
}
```

---

# ============================================================================
# 5. TANK MANAGEMENT
# ============================================================================

## 5.1 List Tanks
**GET** `/tanks`

**Query Parameters:**
- `tank_type` (optional) - Filter by type
- `is_active` (optional) - true/false
- `location` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tanks": [
      {
        "tank_id": 1,
        "tank_code": "IBC-1",
        "tank_name": "IBC Tote 1",
        "tank_type": "IBC",
        "location": "IBC Section",
        "capacity_liters": 600,
        "dimensions": "1.0m × 1.0m × 0.6m",
        "max_stocking_density": 50,
        "current_stocking": {
          "batch_code": "BATCH-2024-043",
          "fish_count": 28000,
          "avg_size_g": 1.5,
          "days_in_tank": 8,
          "stocking_density": 46.7,
          "status": "Well Stocked"
        },
        "is_active": true
      }
    ]
  }
}
```

---

## 5.2 Get Single Tank
**GET** `/tanks/:tank_id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "tank_id": 1,
    "tank_code": "IBC-1",
    "tank_name": "IBC Tote 1",
    "tank_type": "IBC",
    "location": "IBC Section",
    "capacity_liters": 600,
    "length_m": 1.0,
    "width_m": 1.0,
    "depth_m": 0.6,
    "max_stocking_density": 50,
    "is_active": true,
    "installation_date": "2024-01-10",
    "last_maintenance_date": "2024-11-15",
    "current_stocking": {
      "stocking_id": 145,
      "batch_id": 43,
      "batch_code": "BATCH-2024-043",
      "spawn_code": "SP-2024-043",
      "stocked_date": "2024-11-23",
      "initial_count": 30000,
      "current_count": 28000,
      "current_avg_size_g": 1.5,
      "days_in_tank": 8,
      "stocking_density": 46.7,
      "status": "Active"
    },
    "stocking_history": [
      {
        "batch_code": "BATCH-2024-040",
        "stocked_date": "2024-11-10",
        "transfer_date": "2024-11-21",
        "days_in_tank": 11,
        "survival_rate": 93.3
      }
    ],
    "notes": "Regular cleaning schedule, good water flow"
  }
}
```

---

## 5.3 Stock Tank
**POST** `/tanks/:tank_id/stock`

**Request Body:**
```json
{
  "batch_id": 46,
  "spawn_id": 46,
  "stocked_date": "2024-12-02",
  "initial_count": 75000,
  "current_avg_size_g": 0.2,
  "notes": "Transferred from hatching tanks"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Tank stocked successfully",
  "data": {
    "stocking_id": 146,
    "tank_id": 2,
    "tank_code": "IBC-2",
    "batch_id": 46,
    "initial_count": 75000,
    "stocking_density": 125.0,
    "status": "Active"
  }
}
```

---

## 5.4 Update Tank Stocking
**PUT** `/tanks/:tank_id/stocking`

**Request Body:**
```json
{
  "current_count": 72000,
  "current_avg_size_g": 1.8,
  "mortality_today": 500,
  "notes": "Daily count update, removed dead fish"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Tank stocking updated",
  "data": {
    "stocking_id": 146,
    "tank_code": "IBC-2",
    "current_count": 72000,
    "days_in_tank": 5,
    "stocking_density": 120.0
  }
}
```

---

## 5.5 Transfer Fish
**POST** `/tanks/transfer`

**Request Body:**
```json
{
  "from_tank_id": 2,
  "to_tank_id": 10,
  "batch_id": 46,
  "count_moved": 72000,
  "avg_size_g": 2.5,
  "transfer_date": "2024-12-12",
  "reason": "Growth Stage",
  "mortality_during_transfer": 500,
  "notes": "Transferred to elevated tank, fish active"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Fish transferred successfully",
  "data": {
    "movement_id": 89,
    "from_tank": "IBC-2",
    "to_tank": "TOP-1",
    "count_moved": 72000,
    "survival_rate": 99.3
  }
}
```

---

## 5.6 Get Tank Utilization
**GET** `/tanks/utilization`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_tanks": 24,
      "occupied": 18,
      "empty": 6,
      "utilization_percent": 75.0
    },
    "by_type": {
      "Hatching": {"total": 2, "occupied": 2, "utilization": 100},
      "IBC": {"total": 6, "occupied": 5, "utilization": 83.3},
      "Elevated": {"total": 6, "occupied": 5, "utilization": 83.3},
      "Ground": {"total": 8, "occupied": 6, "utilization": 75.0},
      "Tarpaulin": {"total": 2, "occupied": 0, "utilization": 0}
    },
    "tanks": [
      {
        "tank_code": "IBC-1",
        "capacity_liters": 600,
        "fish_count": 28000,
        "stocking_density": 46.7,
        "status": "Well Stocked"
      }
    ]
  }
}
```

---

# ============================================================================
# 6. PRODUCTION TRACKING
# ============================================================================

## 6.1 List Batches
**GET** `/batches`

**Query Parameters:**
- `status` (optional) - 'Active', 'Sold', 'Lost', 'Completed'
- `current_stage` (optional)
- `sort` (default: 'start_date')
- `order` (default: 'desc')
- `page`, `limit`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batches": [
      {
        "batch_id": 46,
        "batch_code": "BATCH-2024-046",
        "spawn_code": "SP-2024-046",
        "start_date": "2024-12-01",
        "initial_count": 100000,
        "current_count": 72000,
        "current_stage": "Fry",
        "current_tank": "IBC-2",
        "current_avg_size_g": 1.8,
        "overall_survival_rate": 72.0,
        "days_old": 11,
        "status": "Active"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 46,
      "total_pages": 3
    }
  }
}
```

---

## 6.2 Get Single Batch
**GET** `/batches/:batch_id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batch_id": 46,
    "batch_code": "BATCH-2024-046",
    "spawn_id": 46,
    "spawn_code": "SP-2024-046",
    "start_date": "2024-12-01",
    "initial_count": 100000,
    "current_count": 72000,
    "current_stage": "Fry",
    "current_tank_id": 2,
    "current_tank_code": "IBC-2",
    "current_avg_size_g": 1.8,
    "overall_survival_rate": 72.0,
    "total_feed_consumed_kg": 15.5,
    "total_feed_cost_ngn": 28000,
    "status": "Active",
    "stage_progression": [
      {
        "stage_name": "Week 0-1 Hatching",
        "tank_code": "HATCH-1",
        "entry_count": 100000,
        "exit_count": 85000,
        "survival_rate": 85.0,
        "days_in_stage": 7
      },
      {
        "stage_name": "Week 1-3 IBC",
        "tank_code": "IBC-2",
        "entry_count": 85000,
        "current_count": 72000,
        "survival_rate": 84.7,
        "days_in_stage": 11,
        "in_progress": true
      }
    ],
    "movements": [
      {
        "movement_date": "2024-12-08",
        "from_tank": "HATCH-1",
        "to_tank": "IBC-2",
        "count_moved": 85000,
        "mortality": 2000
      }
    ],
    "costs": {
      "hormone_cost": 3500,
      "feed_cost": 28000,
      "treatment_cost": 0,
      "allocated_overhead": 12000,
      "total_cost": 43500,
      "cost_per_fish": 0.60
    },
    "notes": "Batch performing well, good appetite",
    "created_at": "2024-12-01T10:00:00Z"
  }
}
```

---

## 6.3 Create Batch
**POST** `/batches`

**Request Body:**
```json
{
  "spawn_id": 46,
  "start_date": "2024-12-01",
  "initial_count": 100000,
  "current_tank_id": 1,
  "current_stage": "Eggs",
  "notes": "New batch from spawn SP-2024-046"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Batch created successfully",
  "data": {
    "batch_id": 46,
    "batch_code": "BATCH-2024-046",
    "spawn_code": "SP-2024-046",
    "start_date": "2024-12-01"
  }
}
```

---

## 6.4 Update Batch
**PUT** `/batches/:batch_id`

**Request Body:**
```json
{
  "current_count": 70000,
  "current_stage": "Small Fingerlings",
  "current_tank_id": 10,
  "current_avg_size_g": 5.2,
  "notes": "Moved to elevated tank, growing well"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Batch updated successfully",
  "data": {
    "batch_id": 46,
    "batch_code": "BATCH-2024-046",
    "current_count": 70000,
    "overall_survival_rate": 70.0
  }
}
```

---

## 6.5 Add Stage Record
**POST** `/batches/:batch_id/stages`

**Request Body:**
```json
{
  "stage_name": "Week 3-6 Elevated",
  "tank_id": 10,
  "entry_date": "2024-12-22",
  "entry_count": 70000,
  "entry_avg_size_g": 2.5,
  "notes": "Transferred to elevated tank TOP-1"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Stage record added",
  "data": {
    "stage_id": 234,
    "batch_id": 46,
    "stage_name": "Week 3-6 Elevated"
  }
}
```

---

## 6.6 Complete Stage
**PUT** `/batches/:batch_id/stages/:stage_id/complete`

**Request Body:**
```json
{
  "exit_date": "2024-12-22",
  "exit_count": 68000,
  "exit_avg_size_g": 5.2,
  "mortality_count": 2000,
  "feed_consumed_kg": 45.5,
  "feed_cost_ngn": 72000,
  "notes": "Good growth, ready for next stage"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Stage completed",
  "data": {
    "stage_id": 234,
    "survival_rate": 97.1,
    "days_in_stage": 21,
    "growth_rate_g_per_day": 0.13,
    "feed_conversion_ratio": 1.35
  }
}
```

---

## 6.7 Get Batch Profitability
**GET** `/batches/:batch_id/profitability`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "batch_id": 46,
    "batch_code": "BATCH-2024-046",
    "costs": {
      "hormone": 3500,
      "feed": 125000,
      "treatments": 5000,
      "allocated_overhead": 35000,
      "total": 168500
    },
    "revenue": {
      "quantity_sold_10g": 30000,
      "revenue_10g": 1500000,
      "quantity_sold_30g": 35000,
      "revenue_30g": 3500000,
      "total": 5000000
    },
    "profit": {
      "gross_profit": 4831500,
      "profit_margin": 96.6,
      "cost_per_fish": 2.59,
      "revenue_per_fish": 76.92
    },
    "status": "Completed"
  }
}
```

---

# ============================================================================
# 7. FEED MANAGEMENT
# ============================================================================

## 7.1 Get Feed Inventory
**GET** `/feed/inventory`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "inventory": [
      {
        "inventory_id": 1,
        "feed_name": "Artemia",
        "category": "Live Feed",
        "current_stock_kg": 3.5,
        "reorder_level_kg": 2.0,
        "unit_cost_ngn": 8000,
        "supplier_name": "Lagos Aqua Supplies",
        "supplier_phone": "08011223344",
        "last_purchase_date": "2024-11-20",
        "expiry_date": "2025-02-20",
        "needs_reorder": false
      },
      {
        "inventory_id": 4,
        "feed_name": "2.0mm Pellets",
        "category": "Pellets",
        "current_stock_kg": 45.0,
        "reorder_level_kg": 100.0,
        "unit_cost_ngn": 1500,
        "supplier_name": "Coppens Feed Dealer",
        "needs_reorder": true
      }
    ],
    "summary": {
      "total_items": 7,
      "items_needing_reorder": 2,
      "total_stock_value_ngn": 487500
    }
  }
}
```

---

## 7.2 Update Feed Stock
**PUT** `/feed/inventory/:inventory_id`

**Request Body:**
```json
{
  "current_stock_kg": 200.0,
  "last_purchase_date": "2024-12-01",
  "last_purchase_quantity_kg": 250.0,
  "unit_cost_ngn": 1450,
  "expiry_date": "2025-12-01"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Feed inventory updated",
  "data": {
    "inventory_id": 4,
    "feed_name": "2.0mm Pellets",
    "current_stock_kg": 200.0,
    "needs_reorder": false
  }
}
```

---

## 7.3 Log Feeding
**POST** `/feed/logs`

**Request Body:**
```json
{
  "log_date": "2024-12-01",
  "log_time": "07:00:00",
  "tank_id": 2,
  "batch_id": 46,
  "feed_type_id": 2,
  "amount_kg": 2.5,
  "fish_appetite": "Good",
  "uneaten_food": false,
  "notes": "Fish fed well, no waste"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Feeding logged successfully",
  "data": {
    "feeding_id": 1234,
    "cost_ngn": 4500,
    "remaining_stock_kg": 147.5
  }
}
```

---

## 7.4 Get Feeding Logs
**GET** `/feed/logs`

**Query Parameters:**
- `tank_id` (optional)
- `batch_id` (optional)
- `date_from` (optional)
- `date_to` (optional)
- `page`, `limit`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "feeding_id": 1234,
        "log_date": "2024-12-01",
        "log_time": "07:00:00",
        "tank_code": "IBC-2",
        "batch_code": "BATCH-2024-046",
        "feed_name": "0.5mm Pellets",
        "amount_kg": 2.5,
        "cost_ngn": 4500,
        "fish_appetite": "Good",
        "fed_by": "John Doe"
      }
    ],
    "pagination": {...}
  }
}
```

---

## 7.5 Log Plant Feed Harvest
**POST** `/feed/plant-harvest`

**Request Body:**
```json
{
  "harvest_date": "2024-12-01",
  "feed_type": "Duckweed",
  "bed_number": 1,
  "fresh_weight_g": 750,
  "used_immediately": true,
  "bed_condition": "Excellent",
  "notes": "Good growth rate, harvested 50%"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Plant feed harvest logged",
  "data": {
    "harvest_id": 456,
    "feed_type": "Duckweed",
    "fresh_weight_g": 750
  }
}
```

---

## 7.6 Get Feed Consumption Report
**GET** `/feed/consumption-report`

**Query Parameters:**
- `batch_id` (optional)
- `period` - 'week', 'month', 'year'

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "total_consumed_kg": 485.5,
    "total_cost_ngn": 728000,
    "by_feed_type": [
      {
        "feed_name": "2.0mm Pellets",
        "quantity_kg": 325.0,
        "cost_ngn": 487500,
        "percent_of_total": 66.9
      }
    ],
    "plant_feed_savings": {
      "duckweed_kg": 18.5,
      "azolla_kg": 6.2,
      "estimated_savings_ngn": 37000
    }
  }
}
```

---

# ============================================================================
# 8. SALES & CUSTOMERS
# ============================================================================

## 8.1 List Customers
**GET** `/customers`

**Query Parameters:**
- `customer_type` (optional)
- `payment_reliability` (optional)
- `search` (optional) - Search by name or phone
- `sort`, `order`, `page`, `limit`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "customers": [
      {
        "customer_id": 1,
        "customer_code": "CUST-001",
        "full_name": "Alhaji Musa Ibrahim",
        "phone_number": "08011223344",
        "location": "Kubwa, Abuja",
        "customer_type": "Fish Farmer",
        "payment_reliability": "Excellent",
        "total_purchases_ngn": 2450000,
        "total_quantity_purchased": 35000,
        "last_purchase_date": "2024-11-25"
      }
    ],
    "pagination": {...}
  }
}
```

---

## 8.2 Get Single Customer
**GET** `/customers/:customer_id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "customer_id": 1,
    "customer_code": "CUST-001",
    "full_name": "Alhaji Musa Ibrahim",
    "phone_number": "08011223344",
    "alternate_phone": "08122334455",
    "location": "Kubwa, Abuja",
    "customer_type": "Fish Farmer",
    "payment_reliability": "Excellent",
    "total_purchases_ngn": 2450000,
    "total_quantity_purchased": 35000,
    "first_purchase_date": "2024-03-15",
    "last_purchase_date": "2024-11-25",
    "purchase_history": [
      {
        "sale_id": 156,
        "sale_code": "SALE-2024-156",
        "sale_date": "2024-11-25",
        "quantity": 5000,
        "size_category": "30-50g",
        "total_amount_ngn": 500000,
        "payment_status": "Paid"
      }
    ],
    "notes": "Reliable customer, always pays on time",
    "created_at": "2024-03-15T10:00:00Z"
  }
}
```

---

## 8.3 Create Customer
**POST** `/customers`

**Request Body:**
```json
{
  "full_name": "Mrs. Ngozi Okafor",
  "phone_number": "08099887766",
  "alternate_phone": "08188776655",
  "location": "Gwagwalada, Abuja",
  "customer_type": "Fish Farmer",
  "notes": "Referred by Alhaji Musa"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Customer created successfully",
  "data": {
    "customer_id": 45,
    "customer_code": "CUST-045",
    "full_name": "Mrs. Ngozi Okafor",
    "phone_number": "08099887766"
  }
}
```

---

## 8.4 Create Sale
**POST** `/sales`

**Request Body:**
```json
{
  "sale_date": "2024-12-01",
  "customer_id": 45,
  "batch_id": 42,
  "quantity_sold": 10000,
  "fish_size_category": "30-50g",
  "avg_size_g": 35,
  "price_per_piece_ngn": 95,
  "delivery_cost_ngn": 5000,
  "payment_method": "Bank Transfer",
  "payment_status": "Paid",
  "amount_paid_ngn": 955000,
  "payment_date": "2024-12-01",
  "delivery_location": "Gwagwalada Farm",
  "delivery_date": "2024-12-01",
  "notes": "Customer very satisfied with quality"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Sale recorded successfully",
  "data": {
    "sale_id": 157,
    "sale_code": "SALE-2024-157",
    "customer_name": "Mrs. Ngozi Okafor",
    "quantity_sold": 10000,
    "subtotal_ngn": 950000,
    "total_amount_ngn": 955000,
    "payment_status": "Paid"
  }
}
```

---

## 8.5 Update Sale
**PUT** `/sales/:sale_id`

**Request Body:**
```json
{
  "payment_status": "Paid",
  "amount_paid_ngn": 955000,
  "payment_date": "2024-12-02",
  "delivery_status": "Delivered",
  "notes": "Payment received, fish delivered"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Sale updated successfully",
  "data": {
    "sale_id": 157,
    "sale_code": "SALE-2024-157",
    "payment_status": "Paid",
    "balance_ngn": 0
  }
}
```

---

## 8.6 Get Sales Report
**GET** `/sales/report`

**Query Parameters:**
- `date_from`, `date_to`
- `customer_id` (optional)
- `size_category` (optional)
- `payment_status` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "2024-11-01 to 2024-11-30",
    "summary": {
      "total_sales": 15,
      "total_quantity": 125000,
      "total_revenue_ngn": 11450000,
      "total_paid_ngn": 10250000,
      "outstanding_ngn": 1200000,
      "avg_price_per_fish_ngn": 91.6
    },
    "by_size_category": {
      "10-15g": {
        "quantity": 50000,
        "revenue_ngn": 2500000,
        "avg_price_ngn": 50
      },
      "30-50g": {
        "quantity": 75000,
        "revenue_ngn": 8950000,
        "avg_price_ngn": 119.3
      }
    },
    "top_customers": [
      {
        "customer_name": "Alhaji Musa Ibrahim",
        "total_purchased": 35000,
        "total_paid_ngn": 3500000
      }
    ]
  }
}
```

---

# ============================================================================
# 9. FINANCIAL TRACKING
# ============================================================================

## 9.1 List Expenses
**GET** `/expenses`

**Query Parameters:**
- `category_id` (optional)
- `date_from`, `date_to` (optional)
- `batch_id` (optional)
- `sort` (default: 'expense_date')
- `order` (default: 'desc')
- `page`, `limit`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "expenses": [
      {
        "expense_id": 234,
        "expense_date": "2024-12-01",
        "category": "Feed",
        "description": "2.0mm pellets - 250kg",
        "amount_ngn": 375000,
        "quantity": 250,
        "unit_cost_ngn": 1500,
        "supplier_name": "Coppens Feed Dealer",
        "payment_method": "Bank Transfer"
      }
    ],
    "pagination": {...}
  }
}
```

---

## 9.2 Create Expense
**POST** `/expenses`

**Request Body:**
```json
{
  "expense_date": "2024-12-01",
  "category_id": 1,
  "description": "2.0mm pellets - 250kg",
  "amount_ngn": 375000,
  "quantity": 250,
  "unit_cost_ngn": 1500,
  "supplier_name": "Coppens Feed Dealer",
  "payment_method": "Bank Transfer",
  "receipt_number": "CPF-20241201-001",
  "notes": "Bulk purchase, good price"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Expense recorded successfully",
  "data": {
    "expense_id": 234,
    "expense_date": "2024-12-01",
    "category": "Feed",
    "amount_ngn": 375000
  }
}
```

---

## 9.3 Get Expense Categories
**GET** `/expenses/categories`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category_id": 1,
        "category_name": "Feed",
        "description": "Commercial feed purchases",
        "is_active": true
      },
      {
        "category_id": 2,
        "category_name": "Hormones",
        "description": "Spawning hormones",
        "is_active": true
      }
    ]
  }
}
```

---

## 9.4 Get Financial Summary
**GET** `/financials/summary`

**Query Parameters:**
- `period` - 'week', 'month', 'quarter', 'year', 'custom'
- `date_from`, `date_to` (for custom period)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "date_range": "2024-11-01 to 2024-11-30",
    "revenue": {
      "total_sales_ngn": 11450000,
      "cash_received_ngn": 10250000,
      "outstanding_ngn": 1200000
    },
    "expenses": {
      "total_ngn": 3850000,
      "by_category": {
        "Feed": 1850000,
        "Hormones": 420000,
        "Power/Fuel": 580000,
        "Labor": 400000,
        "Other": 600000
      }
    },
    "profit": {
      "gross_profit_ngn": 7600000,
      "gross_margin": 66.4,
      "net_profit_ngn": 6400000,
      "net_margin": 55.9
    },
    "comparison_to_budget": {
      "revenue_vs_target": 95.4,
      "expenses_vs_budget": 88.2,
      "profit_vs_target": 102.3
    }
  }
}
```

---

## 9.5 Get P&L Statement
**GET** `/financials/profit-loss`

**Query Parameters:**
- `period` - 'month', 'quarter', 'year'
- `date_from`, `date_to`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "2024 Q4",
    "revenue": {
      "fingerling_sales_10g": 7500000,
      "fingerling_sales_30g": 26850000,
      "total_revenue": 34350000
    },
    "cost_of_goods_sold": {
      "hormones": 1260000,
      "feed": 5550000,
      "treatments": 150000,
      "total_cogs": 6960000
    },
    "gross_profit": 27390000,
    "gross_margin": 79.7,
    "operating_expenses": {
      "power_fuel": 1740000,
      "labor": 1200000,
      "water": 300000,
      "maintenance": 450000,
      "transport": 600000,
      "utilities": 120000,
      "other": 300000,
      "total_opex": 4710000
    },
    "net_profit": 22680000,
    "net_margin": 66.0,
    "ebitda": 22830000
  }
}
```

---

# ============================================================================
# 10. HEALTH & OBSERVATIONS
# ============================================================================

## 10.1 Log Health Issue
**POST** `/health/logs`

**Request Body:**
```json
{
  "log_date": "2024-12-01",
  "log_time": "09:30:00",
  "tank_id": 5,
  "batch_id": 43,
  "issue_type": "Disease",
  "issue_name": "White Spot",
  "symptoms": "White spots on fish body, some fish lethargic",
  "mortality_count": 150,
  "severity": "Moderate",
  "action_taken": "Isolated affected fish, salt bath treatment started",
  "treatment_cost_ngn": 5000,
  "follow_up_required": true,
  "follow_up_date": "2024-12-03",
  "photo_url": "https://storage.tanitrack.com/health/white-spot-001.jpg",
  "notes": "Need to monitor closely for next 48 hours"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Health issue logged successfully",
  "data": {
    "log_id": 67,
    "tank_code": "TOP-1",
    "batch_code": "BATCH-2024-043",
    "issue_name": "White Spot",
    "severity": "Moderate",
    "resolution_status": "Ongoing"
  }
}
```

---

## 10.2 Get Health Logs
**GET** `/health/logs`

**Query Parameters:**
- `tank_id` (optional)
- `batch_id` (optional)
- `issue_type` (optional)
- `resolution_status` (optional)
- `date_from`, `date_to` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "log_id": 67,
        "log_date": "2024-12-01",
        "tank_code": "TOP-1",
        "batch_code": "BATCH-2024-043",
        "issue_type": "Disease",
        "issue_name": "White Spot",
        "severity": "Moderate",
        "mortality_count": 150,
        "action_taken": "Salt bath treatment",
        "resolution_status": "Ongoing",
        "follow_up_date": "2024-12-03"
      }
    ]
  }
}
```

---

## 10.3 Update Health Log
**PUT** `/health/logs/:log_id`

**Request Body:**
```json
{
  "mortality_count": 200,
  "resolution_status": "Resolved",
  "resolution_date": "2024-12-05",
  "notes": "Treatment successful, no new cases for 72 hours"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Health log updated",
  "data": {
    "log_id": 67,
    "resolution_status": "Resolved",
    "total_mortality": 200
  }
}
```

---

## 10.4 Add Treatment
**POST** `/health/logs/:log_id/treatments`

**Request Body:**
```json
{
  "treatment_date": "2024-12-01",
  "treatment_type": "Salt Bath",
  "medication_name": "Marine Salt",
  "dosage": "3% solution for 5 minutes",
  "duration_days": 3,
  "cost_ngn": 2000,
  "notes": "Applied to all affected fish"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Treatment added successfully",
  "data": {
    "treatment_id": 89,
    "health_log_id": 67,
    "treatment_type": "Salt Bath"
  }
}
```

---

## 10.5 Get Health Statistics
**GET** `/health/statistics`

**Query Parameters:**
- `period` - 'month', 'quarter', 'year'

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "total_incidents": 8,
    "resolved": 6,
    "ongoing": 2,
    "mortality": {
      "total_deaths": 2350,
      "mortality_rate": 1.8,
      "major_causes": [
        {"issue_name": "Low Oxygen", "deaths": 800, "percent": 34.0},
        {"issue_name": "Disease", "deaths": 650, "percent": 27.7},
        {"issue_name": "Water Quality", "deaths": 500, "percent": 21.3}
      ]
    },
    "treatment_costs": {
      "total_ngn": 15000,
      "by_type": {
        "Salt Bath": 6000,
        "Antibiotics": 9000
      }
    }
  }
}
```

---

# ============================================================================
# 11. REPORTS & ANALYTICS
# ============================================================================

## 11.1 Get Production Report
**GET** `/reports/production`

**Query Parameters:**
- `period` - 'week', 'month', 'quarter', 'year'
- `date_from`, `date_to`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "spawning": {
      "total_spawns": 12,
      "successful_spawns": 11,
      "success_rate": 91.7,
      "total_eggs": 1200000,
      "avg_eggs_per_spawn": 100000,
      "avg_fertilization_rate": 78.5,
      "avg_hatch_rate": 64.2
    },
    "production": {
      "total_fry_produced": 770400,
      "fingerlings_10g": 150000,
      "fingerlings_30g": 95000,
      "total_fingerlings_sold": 245000,
      "avg_survival_to_10g": 19.5,
      "avg_survival_to_30g": 12.3
    },
    "growth": {
      "avg_days_to_10g": 42,
      "avg_days_to_30g": 70,
      "avg_growth_rate_g_day": 0.43,
      "avg_feed_conversion_ratio": 1.38
    }
  }
}
```

---

## 11.2 Get Financial Report
**GET** `/reports/financial`

**Query Parameters:**
- `period`, `date_from`, `date_to`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "2024 Q4",
    "revenue": {
      "fingerling_sales": 34350000,
      "total_revenue": 34350000
    },
    "costs": {
      "direct_costs": 6960000,
      "operating_expenses": 4710000,
      "total_costs": 11670000
    },
    "profitability": {
      "gross_profit": 27390000,
      "gross_margin": 79.7,
      "net_profit": 22680000,
      "net_margin": 66.0
    },
    "per_unit_economics": {
      "avg_cost_per_fish": 47.63,
      "avg_selling_price": 140.20,
      "avg_profit_per_fish": 92.57
    },
    "trends": {
      "revenue_growth": 15.3,
      "cost_growth": 8.7,
      "profit_growth": 18.9
    }
  }
}
```

---

## 11.3 Get Broodstock Performance Report
**GET** `/reports/broodstock-performance`

**Query Parameters:**
- `period`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "period": "2024",
    "summary": {
      "total_active": 15,
      "total_spawns": 144,
      "avg_spawns_per_female": 9.6,
      "best_performer": "BF-003"
    },
    "females": [
      {
        "broodstock_code": "BF-003",
        "total_spawns": 15,
        "successful_spawns": 14,
        "success_rate": 93.3,
        "avg_egg_count": 58000,
        "avg_fertilization_rate": 85.2,
        "avg_hatch_rate": 70.5,
        "total_fry_produced": 570300
      }
    ],
    "males": [
      {
        "broodstock_code": "BM-001",
        "times_used": 48,
        "avg_fertilization_rate": 78.5
      }
    ]
  }
}
```

---

## 11.4 Get Tank Efficiency Report
**GET** `/reports/tank-efficiency`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overall": {
      "avg_utilization": 78.5,
      "avg_survival_rate": 88.3,
      "total_capacity_liters": 75000,
      "effective_capacity_used": 58875
    },
    "by_tank_type": {
      "IBC": {
        "avg_utilization": 85.0,
        "avg_survival_rate": 90.2
      },
      "Elevated": {
        "avg_utilization": 82.0,
        "avg_survival_rate": 89.5
      },
      "Ground": {
        "avg_utilization": 75.0,
        "avg_survival_rate": 86.8
      }
    },
    "best_performing": [
      {
        "tank_code": "IBC-3",
        "avg_survival_rate": 94.5,
        "avg_utilization": 88.0,
        "batches_completed": 8
      }
    ],
    "underperforming": [
      {
        "tank_code": "GND-5",
        "avg_survival_rate": 82.0,
        "avg_utilization": 65.0,
        "issues": "Frequent water quality problems"
      }
    ]
  }
}
```

---

## 11.5 Export Report
**GET** `/reports/export`

**Query Parameters:**
- `report_type` - 'production', 'financial', 'sales', 'inventory'
- `format` - 'pdf', 'excel', 'csv'
- `period`, `date_from`, `date_to`

**Response (200):**
```json
{
  "success": true,
  "message": "Report generated successfully",
  "data": {
    "report_url": "https://storage.tanitrack.com/reports/production-2024-Q4.pdf",
    "file_name": "TaniTrack_Production_Report_2024Q4.pdf",
    "file_size_mb": 2.3,
    "expires_at": "2024-12-08T10:00:00Z"
  }
}
```

---

# ============================================================================
# 12. SYSTEM & CONFIGURATION
# ============================================================================

## 12.1 Get App Settings
**GET** `/settings`

**Permission:** owner, manager only

**Response (200):**
```json
{
  "success": true,
  "data": {
    "settings": [
      {
        "setting_key": "company_name",
        "setting_value": "Tani Nigeria Ltd",
        "setting_type": "string",
        "is_user_editable": true
      },
      {
        "setting_key": "currency_symbol",
        "setting_value": "₦",
        "setting_type": "string",
        "is_user_editable": false
      }
    ]
  }
}
```

---

## 12.2 Update Setting
**PUT** `/settings/:setting_key`

**Permission:** owner only

**Request Body:**
```json
{
  "setting_value": "New Value"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Setting updated successfully",
  "data": {
    "setting_key": "company_name",
    "setting_value": "New Value"
  }
}
```

---

## 12.3 Get Notifications
**GET** `/notifications`

**Query Parameters:**
- `is_read` (optional) - true/false
- `notification_type` (optional)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "unread_count": 5,
    "notifications": [
      {
        "notification_id": 234,
        "notification_type": "Low Stock",
        "title": "Feed Stock Low",
        "message": "2.0mm Pellets stock (45kg) below reorder level (100kg)",
        "severity": "Warning",
        "is_read": false,
        "action_url": "/feed/inventory",
        "created_at": "2024-12-01T08:00:00Z"
      }
    ]
  }
}
```

---

## 12.4 Mark Notification as Read
**PUT** `/notifications/:notification_id/read`

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 12.5 Get System Statistics
**GET** `/system/statistics`

**Permission:** owner, manager only

**Response (200):**
```json
{
  "success": true,
  "data": {
    "database": {
      "total_spawns": 245,
      "total_batches": 240,
      "total_customers": 87,
      "total_sales": 523,
      "total_users": 5
    },
    "storage": {
      "photos_count": 1250,
      "storage_used_mb": 487,
      "storage_limit_mb": 10000
    },
    "activity": {
      "daily_active_users": 4,
      "records_created_today": 23,
      "last_backup": "2024-12-01T02:00:00Z"
    }
  }
}
```

---

# ============================================================================
# WEBHOOKS (Future Feature)
# ============================================================================

## Webhook Events
The system can send webhooks for the following events:
- `spawn.created`
- `spawn.completed`
- `batch.created`
- `batch.sold`
- `sale.created`
- `sale.payment_received`
- `health.issue_logged`
- `feed.stock_low`

**Webhook Payload Format:**
```json
{
  "event": "sale.created",
  "timestamp": "2024-12-01T10:30:00Z",
  "data": {
    "sale_id": 157,
    "sale_code": "SALE-2024-157",
    "customer_name": "Mrs. Ngozi Okafor",
    "total_amount_ngn": 955000
  }
}
```

---

# ============================================================================
# RATE LIMITING
# ============================================================================

**Limits:**
- Anonymous: 100 requests per hour
- Authenticated: 1000 requests per hour
- Admin/Owner: 5000 requests per hour

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1701432000
```

**429 Response:**
```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": {
    "code": "RATE_LIMIT",
    "retry_after": 3600
  }
}
```

---

# ============================================================================
# PAGINATION
# ============================================================================

All list endpoints support pagination:

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response Format:**
```json
{
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "total_pages": 13,
    "has_prev": false,
    "has_next": true,
    "prev_page": null,
    "next_page": 2
  }
}
```

---

# ============================================================================
# SEARCH & FILTERING
# ============================================================================

Many endpoints support search and filtering:

**Common Query Parameters:**
- `search` - Full-text search
- `sort` - Field to sort by
- `order` - 'asc' or 'desc'
- `date_from`, `date_to` - Date range filters
- Entity-specific filters (status, type, etc.)

**Example:**
```
GET /batches?status=Active&sort=start_date&order=desc&page=1&limit=20
```

---

# ============================================================================
# FILE UPLOADS
# ============================================================================

For photo uploads (broodstock, health logs, etc.):

**POST** `/uploads/photo`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` - Image file (max 5MB)
- `type` - 'broodstock', 'health', 'spawn'
- `entity_id` - Related entity ID

**Response:**
```json
{
  "success": true,
  "data": {
    "file_url": "https://storage.tanitrack.com/photos/abc123.jpg",
    "file_name": "abc123.jpg",
    "file_size_kb": 234
  }
}
```

---

# ============================================================================
# END OF API DOCUMENTATION
# ============================================================================

## Next Steps for Development:
1. Implement authentication middleware (JWT)
2. Build database models based on schema
3. Create API routes following this specification
4. Add input validation (use Joi or similar)
5. Implement error handling middleware
6. Add request logging
7. Set up automated tests
8. Configure CORS for frontend
9. Deploy to production server

## Testing the API:
Use Postman or similar tool to test endpoints:
1. Import this documentation into Postman
2. Set up environment variables (base_url, token)
3. Test each endpoint with sample data
4. Verify response formats match specification

## Security Checklist:
- ✅ JWT authentication on all protected routes
- ✅ Password hashing (bcrypt)
- ✅ Input validation & sanitization
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS prevention
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ HTTPS only in production
- ✅ Secure file upload validation
