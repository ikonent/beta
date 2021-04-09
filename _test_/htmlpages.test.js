const request = require("supertest");
const app = require("../app");

/*describe("Test the root path", () => {
   test("Response to the GET /", () => {
      return request(app)
         .get("/")
         .set("Accept", "text/html")
         .expect("Content-Type", /html/)
         .expect(200);
   });
});*/

describe("Test the about", () => {
   test("Response to the GET about", () => {
      return request(app)
         .get("/about")
         .set("Accept", "text/html")
         .expect("Content-Type", /html/)
         .expect(200);
   });
});

/*describe("Test the login", () => {
   test("Response to the GET login", () => {
      return request(app)
         .get("/users/login")
         .set("Accept", "text/html")
         .expect("Content-Type", /html/)
         .expect(200);
   });
});*/

/*describe("Test the registartion", () => {
   test("Response to the GET register", () => {
      return request(app)
         .get("/users/register")
         .set("Accept", "text/html")
         .expect("Content-Type", /html/)
         .expect(200);
   });
});

describe("Test the messages", () => {
   test("Response to the GET messages", () => {
      return request(app)
         .get("/messages")
         .expect("Content-Type", "application/json; charset=utf-8")
         .expect(200);
   });
});

/*describe("Test /messages -post",() => {
 test("Response to the POST", () => {
  return request(app)
   .post("/messages")
   .send({
   	"message": "To post",
   	"sender": "Jest",
   	"topic": "POST"})
   .then(res => {
     expect(res.status).toBe(201)
    })
 });
});
*/

//http message 200 => The request has succeeded.
