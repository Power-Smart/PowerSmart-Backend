export const sse_array = [];

export const remove_sse = (id) => {
    let index = sse_array.findIndex(sse => sse.id === id);
    sse_array.splice(index, 1);
}

export const add_sse = (id, res) => {
    sse_array.push({ id, res });
}

export const sse_headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive"
}