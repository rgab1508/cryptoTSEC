var crypto = require('crypto');

export default function SHA256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
}