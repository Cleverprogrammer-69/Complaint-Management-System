import { TryCatch } from "../middlewares/error.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { mssql, connect } from "../utils/features.js";

// CREATE DEPARTMENT
export const createDepartment = TryCatch(async (req, res, next) => {
  let { deptt_name } = req.body;

  if (!deptt_name) {
    throw new ApiError(
      400,
      "All department fields are required and must be valid"
    );
  }

  deptt_name = deptt_name.trim().toUpperCase();

  const pool = await connect();
  await pool.request().input("deptt_name", mssql.VarChar, deptt_name).query(`
            INSERT INTO Departments (deptt_name)
            VALUES (@deptt_name)
        `);

  res.json({ message: "Department created successfully" });
});

// GET ALL DEPARTMENTS
export const getDepartments = TryCatch(async (req, res, next) => {
  const pool = await connect();
  const result = await pool.request().query(`SELECT * FROM Departments`);
  res.json(result.recordset);
});

// GET SINGLE DEPARTMENT
export const getDepartment = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const pool = await connect();
  const result = await pool
    .request()
    .input("id", mssql.Int, id)
    .query(`SELECT * FROM Departments WHERE deptt_id = @id`);

  if (result.recordset.length === 0) {
    throw new ApiError(404, "Department not found");
  }

  res.json(result.recordset[0]);
});

// DELETE DEPARTMENT
export const deleteDepartment = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  const pool = await connect();
  const result = await pool
    .request()
    .input("id", mssql.Int, id)
    .query(`DELETE FROM Departments WHERE deptt_id = @id`);

  if (result.rowsAffected[0] === 0) {
    throw new ApiError(404, "Department not found");
  }

  res.json({ message: "Department deleted successfully" });
});

// UPDATE DEPARTMENT
export const updateDepartment = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let { deptt_name } = req.body;

  if (deptt_name === undefined || deptt_name.trim() == "") {
     next(new ApiError(400, "department name is required to update"));
  }

  if (typeof deptt_name === "string")
    deptt_name = deptt_name.trim().toUpperCase();

  const pool = await connect();
  const request = pool.request();
  const result = await request
    .input("id", mssql.Int, Number(id))
    .input("deptt_name", mssql.VarChar(100), deptt_name).query(`
        UPDATE Departments
        SET deptt_name = @deptt_name
        WHERE deptt_id = @id
    `);

  if (result.rowsAffected[0] === 0) {
    throw new ApiError(404, "Department not found");
  }

  res.json({ message: "Department updated successfully" });
});
