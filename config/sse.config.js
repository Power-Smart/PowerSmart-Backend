export const sse_array = [];

const remove_sse_client = (id) => {
    let index = sse_array.findIndex(sse => sse.id === id);
    sse_array.splice(index, 1);
}

const add_sse_client = (id, res, type = 1) => {
    sse_array.push({ id, res, type: +type });
}

export const print_sse_array = () => {
    console.log('SSE array', sse_array.map((item) => ({ user_id: item.id, type: item.type })));
}

export const send_sse_data = (user_id, data) => {
    let index = sse_array.findIndex(sse => +sse.id === +user_id);
    if (index !== -1) {
        sse_array[index].res.write(`data: ${data}\n\n`);
    }
}

export const get_sse_client = (user_id) => {
    let index = sse_array.findIndex(sse => +sse.id === +user_id);
    if (index !== -1) {
        return sse_array[index].res;
    }
    return null;
}

export const sse_middleware = (req, res, next) => {
    const { user_id } = req.params;

    if (sse_array.findIndex(sse => +sse.id === +user_id) === -1) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        add_sse_client(user_id, res);
        print_sse_array();

        req.on('close', () => {
            remove_sse_client(user_id);
            console.log('SSE client removed');
            print_sse_array();
            res.end();
        });
    }

    next();
}
