async function POST(endpoint, data = {}) {
    let res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    })
    return await res.json()
}

async function GET(endpoint) {
    let res = await fetch(endpoint)
    return await res.json()
}

async function getUser() {
    let data = await GET("/api/user")
    if (Object.keys(data).length === 0) {
        return undefined
    }
    return data
}