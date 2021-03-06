import Block from './Block';
import Transaction from './Transaction';


export default class BlockChain {
    constructor() {
        this.difficulty = 3;
        this.blocks = [this.genesisBlock()];
    }

    import(blockchain) {
        this.blocks = [];
        blockchain.forEach((block,i) => {
            this.blocks.push(new Block(block.index, block.timestamp, block.data, block.hash, block.prevHash, block.nonce, block.mined_by));
        });
    }

    genesisBlock() {
        return new Block(0,0,[{sender_address: 0, reciever_address: '04bf0a66adfdf2e5aa1795b7b1b30c6fe26f41e95f49eb35a24fbf351e7d63c4427098b4e8bdae6fdc70758d44b26ebb0eca86cdf2a837124626c096b9e5fba13c', amount: 100, signature: ''}],0,0,0,0);
    }

    isValid() {
        if (JSON.stringify(this.blocks[0]) != JSON.stringify(this.genesisBlock())) return false; 
        for (var i = 1; i < this.blocks.length; i++) {
            var curr = this.blocks[i];
			var prev = this.blocks[i - 1];
			if (curr.hash !== curr.calculateHash()) return false;
            if (curr.prevHash !== prev.hash) return false;
            if (!curr.hash.startsWith("0".repeat(this.difficulty))) return false;
            for (var i in curr.data) {
                var transaction = new Transaction(curr.data[i].sender_address, curr.data[i].reciever_address, curr.data[i].amount, curr.data[i].signature, curr.mined_by);
                if (!transaction.isValid()) return false;
            }
        }
        return true;
    }

    export() {
        return this.blocks.map(block => (
            {
                index: block.index,
                timestamp: block.timestamp,
                data: block.data,
                hash: block.hash,
                prevHash: block.prevHash,
                nonce: block.nonce,
                mined_by: block.mined_by
            }
        ));
    
    }

    lastBlock() {
        return this.blocks[this.blocks.length-1];
    }

    addBlock(data,address) {
        var lastBlock = this.lastBlock();
        var block = new Block(lastBlock.index+1, new Date().getTime(), data, "", lastBlock.hash, 0, address);
        block.mineBlock(this.difficulty);
        this.blocks.push(block);
    }

    getBalance(address) {
        var balance = 0;
        for (var i = 0; i < this.blocks.length; i++) {
            for (var transaction of this.blocks[i].data) {
                if (transaction.sender_address == address) balance -= transaction.amount;
                if (transaction.reciever_address == address) balance += transaction.amount;
            }
        }
        return balance;
    }
}