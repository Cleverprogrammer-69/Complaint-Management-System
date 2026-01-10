import { connect, mssql } from "../utils/features.js";
import { ApiError } from "../utils/ApiError.js";
import { TryCatch } from "../middlewares/error.middleware.js";

export const assignJobToResolver = TryCatch(async (req, res) => {
  const { department_ids, service_ids } = req.body;
  const admin = req.user;
  const { resolverId: user_id } = req.params;
  console.log(typeof user_id)
  /* ─────────────────────────────
     1. AUTHORIZATION & IDENTITY
  ───────────────────────────── */
  if (!admin || admin.role !== "ADMIN") {
    throw new ApiError(403, "You are not authorized to perform this action.");
  }

  /* ────────────────────────────── 
     2. BASIC PAYLOAD SANITY
  ───────────────────────────── */
  if (!user_id) {
    throw new ApiError(400, "Valid user_id is required.");
  }

  if (
    (department_ids && !Array.isArray(department_ids)) ||
    (service_ids && !Array.isArray(service_ids))
  ) {
    throw new ApiError(
      400,
      "department_ids and service_ids must be arrays."
    );
  }

  const deptIds = Array.isArray(department_ids) ? department_ids : [];
  const serviceIds = Array.isArray(service_ids) ? service_ids : [];

  if (deptIds.length === 0 && serviceIds.length === 0) {
    throw new ApiError(
      400,
      "At least one department or service must be assigned."
    );
  }

  /* ─────────────────────────────
     3. DATA PURIFICATION
  ───────────────────────────── */
  const cleanDeptIds = [...new Set(deptIds)]
    .filter(id => Number.isInteger(id) && id > 0);

  const cleanServiceIds = [...new Set(serviceIds)]
    .filter(id => Number.isInteger(id) && id > 0);

  if (cleanDeptIds.length !== deptIds.length ||
      cleanServiceIds.length !== serviceIds.length) {
    throw new ApiError(
      400,
      "Invalid IDs detected in department or service list."
    );
  }

  /* ─────────────────────────────
     4. DATABASE PRE-CHECKS
  ───────────────────────────── */
  const pool = await connect();
  const precheck = pool.request();

  const resolverCheck = await precheck
    .input("user_id", mssql.Int, user_id)
    .query(`
      SELECT u.user_id, r.role_name
      FROM Users u
      JOIN Roles r ON u.role_id = r.role_id
      WHERE u.user_id = @user_id AND r.role_name = 'RESOLVER'
    `);

  if (resolverCheck.recordset.length === 0) {
    throw new ApiError(
      404,
      "Resolver not found or not eligible for assignment."
    );
  }

  /* ─────────────────────────────
     5. TVP CONSTRUCTION (CLEAN)
  ───────────────────────────── */
  const deptTable = new mssql.Table("DepartmentIdList");
  deptTable.columns.add("department_id", mssql.Int);

  cleanDeptIds.forEach(id => deptTable.rows.add(id));

  const serviceTable = new mssql.Table("ServiceIdList");
  serviceTable.columns.add("service_id", mssql.Int);

  cleanServiceIds.forEach(id => serviceTable.rows.add(id));

  /* ─────────────────────────────
     6. PROCEDURE EXECUTION
  ───────────────────────────── */
  try {
    await pool.request()
      .input("user_id", mssql.Int, user_id)
      .input("department_ids", deptTable)
      .input("service_ids", serviceTable)
      .input("granted_by", mssql.Int, admin.id)
      .execute("dbo.AssignResolverAccess");

    res.status(200).json({
      success: true,
      message: "Resolver responsibilities assigned successfully.",
    });

  } catch (err) {
    console.error("Assignment procedure failed:", err);
    throw new ApiError(
      500,
      "Failed to assign resolver responsibilities."
    );
  }
});
