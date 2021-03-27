import SHA256 from './SHA256';

export default class Block {
	constructor(index, timestamp, data, hash, prevHash, nonce, mined_by) {
		this.index = index;
		this.prevHash = prevHash;
		this.timestamp = timestamp;
		this.data = data;
		this.hash = hash;
        this.nonce = nonce;
        this.mined_by = mined_by;
	}

	calculateHash() {
		return SHA256(this.index + this.prevHash + this.timestamp + this.nonce + this.mined_by + JSON.stringify(this.data)).toString();
	}

    mineBlock(difficulty) {
        while(!this.calculateHash().startsWith("0".repeat(difficulty))) this.nonce++;
        this.hash = this.calculateHash();
    }
}