import SHA256 from './SHA256';
import elliptic from 'elliptic';

var EC = elliptic.ec;
var ec = new EC('secp256k1');

export default class Transaction {
    constructor(sender_address, reciever_address, amount, signature, mined_by) {
      this.sender_address = sender_address;
      this.reciever_address = reciever_address;
      this.amount = amount;
      this.signature = signature;
      this.mined_by = mined_by;
    }
  
    calculateHash() {
      return SHA256(this.sender_address + this.reciever_address + this.amount);
    }
  
    isValid() {
        var publicKey = ec.keyFromPublic(this.sender_address,'hex');
        if (this.sender_address == 0 && this.reciever_address == this.mined_by) return true;
        try {
            if (publicKey.verify(this.calculateHash(),this.signature)) return true;
            else return false;
        }
        catch (e) {
            return false;
        }
    }
  }