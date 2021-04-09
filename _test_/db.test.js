const request = require("supertest");
const app = require("../app");
const db = require("../dbOperations.js");

describe('Test the database methods', () => {
	it('testing db.findMessages function', () => {
		return db.findMessages(function(data) {
			expect(typeof(data)).toBe("object");

		});
	});
});



/*describe('Test the database methods', () => {
	it('testing db.findMessageById function', () => {
		var id = 0;
		return db.findMessageById(id, function(data) {
			expect(data.id).toBe(0);
			expect(data.sender).toBe("Gösta");
			expect(data.topic).toBe("SmartICT");
			expect(data.message).toBe("Heippa koodarit");
		});
	});
});*/


/*describe('Test the database methods', () => {
	it('testing db.createMessage function', () => {
		var add = {"message": "db.createMessage", "sender": "Jest", "topic": "Function test"};
		db.createMessage(add, function(id) {
			return db.findMessageById(id, function(data) {
					expect(data.sender).toBe("Jest");
					expect(data.topic).toBe("Function test");
					expect(data.message).toBe("db.createMessage");
			});
		});
	});
});*/



/*describe('Test the database methods', () => {
	it('testing db.deleteMessageById function', () => {
		var id = 492;
		return db.deleteMessageById(id, function(data) {
			expect(data.id).toBe(0);
			//expect(data.sender).toBe("");
			//expect(data.topic).toBe("");
			//expect(data.message).toBe("");
		});
	});
});


describe('Test the database methods', () => {
	it('testing verifyUserId function', () => {
		var userid = "lö2";
		return db.verifyUserId(userid, function(data) {
			expect(req.body.userid).toBe("lö2");
			expect(req.body.passwd).toBe("lö2");
			expect(data.sender).toBe("Jest");
			expect(data.topic).toBe("Function test");
			expect(data.message).toBe("verifyUserId");
		});
	});
});*/