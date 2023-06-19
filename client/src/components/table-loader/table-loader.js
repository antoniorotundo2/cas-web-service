import React from 'react'

function TableLoader() {
    return (
        <>
            <div style={{ padding: "24px", textAlign: "center", fontSize: "2em" }}>
                <i class='bx bx-loader bx-spin' style={{ fontSize: "4em" }}></i>
                <div>
                    Loading
                </div>
            </div>
        </>
    )
}

export default TableLoader