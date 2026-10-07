import assert from "node:assert/strict"
import test from "node:test"
import { nextStatusesForRole } from "../src/lib/complaints/workflow"
import { parseComplaintQuery, parseUserQuery } from "../src/lib/query-state"
import { safeNextPath } from "../src/lib/auth/roles"

test("complaint query keeps valid filters and drops unknown ones", () => {
  const params = new URLSearchParams(
    "page=2&status=IN_PROGRESS&priority=HIGH&search=road&sortBy=title&sortOrder=asc&status=NOPE",
  )
  params.set("status", "IN_PROGRESS")

  assert.deepEqual(parseComplaintQuery(params), {
    page: 2,
    limit: 10,
    search: "road",
    status: "IN_PROGRESS",
    priority: "HIGH",
    categoryId: undefined,
    departmentId: undefined,
    sortBy: "title",
    sortOrder: "asc",
  })
})

test("invalid page and status fall back", () => {
  const params = new URLSearchParams("page=0&status=OPEN")
  const query = parseComplaintQuery(params)
  assert.equal(query.page, 1)
  assert.equal(query.status, undefined)
})

test("user query accepts a real role only", () => {
  const query = parseUserQuery(new URLSearchParams("role=STAFF&sortBy=email"))
  assert.equal(query.role, "STAFF")
  assert.equal(query.sortBy, "email")
  assert.equal(parseUserQuery(new URLSearchParams("role=MAYOR")).role, undefined)
})

test("next path stays inside the signed-in role", () => {
  assert.equal(safeNextPath("/admin/users", "ADMIN"), "/admin/users")
  assert.equal(safeNextPath("/admin/users", "CITIZEN"), "/dashboard")
  assert.equal(safeNextPath("https://evil.example", "ADMIN"), "/admin")
  assert.equal(safeNextPath("//evil.example", "STAFF"), "/staff")
})

test("staff can only move work to in progress or resolved", () => {
  assert.deepEqual(nextStatusesForRole("STAFF", "ASSIGNED"), ["IN_PROGRESS"])
  assert.deepEqual(nextStatusesForRole("STAFF", "IN_PROGRESS"), ["RESOLVED"])
  assert.deepEqual(nextStatusesForRole("CITIZEN", "SUBMITTED"), ["CANCELLED"])
  assert.deepEqual(nextStatusesForRole("CITIZEN", "IN_PROGRESS"), [])
  assert.deepEqual(nextStatusesForRole("ADMIN", "RESOLVED"), ["CLOSED"])
})
