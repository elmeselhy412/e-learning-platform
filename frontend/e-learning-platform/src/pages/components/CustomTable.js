import React from "react";

const CustomTable = ({ data, columns, showActions, onEdit, onDelete }) => {
    return (
        <div className="card shadow-sm p-3">
            <table className="table table-striped table-dark">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                        {showActions && <th>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {columns.map((col) => (
                                <td key={col.key}>{row[col.key]}</td>
                            ))}
                            {showActions && (
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary me-2"
                                        onClick={() => onEdit(row)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() => onDelete(row._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CustomTable;
