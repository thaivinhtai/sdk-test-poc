// @ts-ignore
import net from "net";

/**
 * Tìm một port ngẫu nhiên chưa được sử dụng
 * @returns {Promise<number>} - Port khả dụng
 */
export function getRandomPort() {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.listen(0, () => {
            const port = server.address().port;
            server.close(() => resolve(port));
        });
        server.on("error", (err) => reject(err));
    });
}
