const request = require("supertest");
const app = require("../app");

describe("Test messages POST", () => {
   test("Response to the POST/messages", () => {
      return request(app)
         .post("/messages")
         .set("Content-Type", "aplication/json")
         .send ({
         	"message": "hello supertest",
         	"sender" : "jest",
         	"topic"  : "test"
         })
         .expect(403);

   });
});



/*describe("Test messages PATCH", () => {
   test("Response to the PATCH/messages", () => {
      return request(app)
         .patch("/messages/426/message")
         .set("Content-Type", "aplication/json")
         .set ({
         	"message": "i will change you"
         })
         .expect(200);
   });
});*/


/*describe("Test messages GET", () => {
   test("Response to the GET/messages", () => {
      return request(app)
         .get("/messages")
         //.set("Content-Type", "aplication/json")
         .expect(200)
   });
});*/


/*describe("Test messages DELETE by ID when user is registered", () => {
   test("Response to the DELETE/message", () => {
      return request(app)
         .delete("/messages/493")
         //.set("Content-Type", "aplication/json",)
         .expect(201)
   });
});


/*describe("Test messages DELETE by ID when user is not registered", () => {
   test("Response to the DELETE/message", () => {
      return request(app)
         .delete("/messages/:id")
         //.set("Content-Type", "aplication/json")
         .expect(403)
   });
});*/




/*describe("Test GET message by ID", () => {
   test("Response to the get('/:id/:message')", () => {
      return request(app)
         .get("/messages/430/message")
         //.set("Content-Type", "aplication/json")
         .expect(200)
   });
});
*/







