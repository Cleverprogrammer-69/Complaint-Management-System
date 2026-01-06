import { TryCatch } from "../middlewares/error.middleware.js";
import { ApiError } from "../utils/ApiError.js";
import { mssql, connect } from "../utils/features.js";
import validator from "validator";
export const createService = TryCatch(async (req, res) => {
  let { issue_id, service_name } = req.body;

  if (!issue_id || !service_name) {
    throw new ApiError(400, "issue_id and service_name required.");
  }
  service_name = service_name.trim().toUpperCase();

  const pool = await connect();
  const issue = await pool
    .request()
    .input("issue_id", mssql.Int, issue_id)
    .query(`SELECT * FROM Issues WHERE issue_id = @issue_id`);
  if (issue.recordset.length === 0) {
    throw new ApiError(404, "Issue not found.");
  }

  const existingService = await pool
    .request()
    .input("issue_id", mssql.Int, issue_id)
    .input("service_name", mssql.VarChar, service_name)
    .query(
      `SELECT * FROM Services WHERE issue_id = @issue_id AND service_name = @service_name`
    );
  if (existingService.recordset.length > 0) {
    throw new ApiError(409, "Service type already exists for this issue.");
  }
  await pool
    .request()
    .input("issue_id", mssql.Int, issue_id)
    .input("service_name", mssql.VarChar, service_name).query(`
      INSERT INTO Services(issue_id, service_name)
      VALUES (@issue_id, @service_name)
    `);

  res.status(201).json({ message: "Service type created." });
});

export const getServices = TryCatch(async (req, res) => {
  const pool = await connect();
  const result = await pool.request().query(`
    SELECT s.*, i.issue_type
    FROM Services s
    JOIN Issues i ON s.issue_id = i.issue_id
  `);
  res.json(result.recordset);
});

export const getService = TryCatch(async (req, res) => {
  const { id } = req.params;
  const pool = await connect();
  const service = await pool.request().input("id", mssql.Int, id).query(`
    SELECT s.*, i.issue_type 
    FROM Services s
    JOIN Issues i ON s.issue_id = i.issue_id
    WHERE s.service_id = @id
  `);
  if (service.recordset.length === 0) {
    throw new ApiError(404, "Service type not found.");
  }
  res.json(service.recordset[0]);
});

export const deleteService = TryCatch(async (req, res) => {
  const { id } = req.params;
  const pool = await connect();
  const result = await pool
    .request()
    .input("id", mssql.Int, id)
    .query(`DELETE FROM Services WHERE service_id = @id`);
  if (result.rowsAffected[0] === 0) {
    throw new ApiError(404, "Service type not found.");
  }
  res.json({ message: "Service type deleted successfully." });
});

export const updateService = TryCatch(async (req, res) => {
  const { id } = req.params;
  let { issue_id, service_name } = req.body;

  if (issue_id === undefined && service_name === undefined) {
    throw new ApiError(400, "At least one field (issue_id or service_name) is required to update.");
  }

  const pool = await connect();

  // Fetch current record
  const currentService = await pool.request().input("id", mssql.Int, id).query(`
    SELECT * FROM Services WHERE service_id = @id
  `);
  if (currentService.recordset.length === 0) {
    throw new ApiError(404, "Service not found.");
  }

  const existing = currentService.recordset[0];
  const finalIssueId = issue_id !== undefined ? issue_id : existing.issue_id;
  const finalServiceName = service_name !== undefined ? service_name.trim().toUpperCase() : existing.service_name;

  // Validate issue exists if issue_id is being updated
  if (issue_id !== undefined) {
    const issue = await pool.request().input("issue_id", mssql.Int, finalIssueId).query(`
      SELECT * FROM Issues WHERE issue_id = @issue_id
    `);
    if (issue.recordset.length === 0) {
      throw new ApiError(404, "Issue not found.");
    }
  }

  // Check for duplicates
  const duplicateCheck = await pool.request()
    .input("issue_id", mssql.Int, finalIssueId)
    .input("service_name", mssql.VarChar, finalServiceName)
    .input("id", mssql.Int, id)
    .query(`
      SELECT * FROM Services WHERE issue_id = @issue_id AND service_name = @service_name AND service_id != @id
    `);
  if (duplicateCheck.recordset.length > 0) {
    throw new ApiError(409, "Service already exists for this issue.");
  }

  // Build update query
  const request = pool.request();
  request.input("id", mssql.Int, id);

  const setClauses: string[] = [];
  if (issue_id !== undefined) {
    request.input("issue_id", mssql.Int, finalIssueId);
    setClauses.push("issue_id = @issue_id");
  }
  if (service_name !== undefined) {
    request.input("service_name", mssql.VarChar, finalServiceName);
    setClauses.push("service_name = @service_name");
  }

  const query = `
    UPDATE Services
    SET ${setClauses.join(", ")}, updated_at = SYSDATETIME()
    WHERE service_id = @id
  `;

  const result = await request.query(query);

  if (result.rowsAffected[0] === 0) {
    throw new ApiError(404, "Service not found.");
  }

  res.json({ message: "Service updated successfully." });
});
