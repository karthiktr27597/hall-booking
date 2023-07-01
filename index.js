const express = require("express");
const app = express();
app.use(express.json())


let rooms = [
    {
        "roomId": 1,
        "roomName": "Hall1",
        "numberOfSeats": 100,
        "amenities": [
            "AC",
            "Projector",
            "chairs",
            "coffeeMachine"
        ],
        "priceAnHour": 1000,
        "bookedStatus": true,
        "customerName": "Raj",
        "date": "30-06-2023",
        "startTime": "16:00",
        "endTime": "20:00",
        "bookingId": 1,
        "bookingDate": "30/6/2023, 6:55:17 pm",
        "bookingStatus": "successful"
    },
    {
        "roomId": 2,
        "roomName": "Hall2",
        "numberOfSeats": 50,
        "amenities": [
            "AC",
            "Projector",
            "chairs",
            "coffeeMachine"
        ],
        "priceAnHour": 500,
        "bookedStatus": false
    },
    {
        "roomId": 3,
        "roomName": "Hall3",
        "numberOfSeats": 50,
        "amenities": [
            "AC",
            "Projector",
            "chairs",
            "coffeeMachine"
        ],
        "priceAnHour": 500,
        "bookedStatus": false
    }

]

let bookedHistory = [
    {
        "roomId": 1,
        "roomName": "Hall1",
        "numberOfSeats": 100,
        "amenities": [
            "AC",
            "Projector",
            "chairs",
            "coffeeMachine"
        ],
        "priceAnHour": 1000,
        "bookedStatus": true,
        "customerName": "Raj",
        "date": "30-06-2023",
        "startTime": "16:00",
        "endTime": "20:00",
        "bookingId": 1,
        "bookingDate": "30/6/2023, 6:55:17 pm",
        "bookingStatus": "successful"
    }

]


// 1. api for create room
app.post("/room/create", (req, res) => {
    try {
        let newRoom = req.body;
        // console.log(newRoom.length);
        if (newRoom.numberOfSeats && newRoom.amenities && newRoom.priceAnHour) {
            rooms.push({ roomId: rooms.length + 1, roomName: "Hall" + (rooms.length + 1), ...newRoom, bookedStatus: false });
            res.status(200).send({ "room added successfully": "Hall" + (rooms.length), "roomList": rooms });
        }
        else {
            res.status(400).send("Incorrect input please check and update numberofSeats, amenities and priceAnHour");
        }
    } catch (err) {
        res.status(400).send({ "Incorrect input": "error:", err });
    }

})

// 2. Booking a room
app.post("/roombook/:roomId", (req, res) => {

    let { roomId } = req.params
    // console.log(roomId)
    let order = req.body;
    // console.log(order);

    const seletedRoom = rooms.find((val) => val.roomId == roomId)
    // console.log("seletedRoom", seletedRoom);
    // console.log(seletedRoom.bookedStatus);

    if (!seletedRoom.bookedStatus) {

        seletedRoom.bookedStatus = true;
        seletedRoom.customerName = order.customerName
        seletedRoom.date = order.date
        seletedRoom.startTime = order.startTime
        seletedRoom.endTime = order.endTime
        seletedRoom.bookingId = bookedHistory.length + 1;
        seletedRoom.bookingDate = new Date().toLocaleString();
        seletedRoom.bookingStatus = "successful";

        bookedHistory.push(seletedRoom);
        res.status(200).send({ "room booked successfully1": seletedRoom })
    }
    else if (seletedRoom.bookedStatus) {
        if (seletedRoom.date !== order.date) {

            let book2 = { ...seletedRoom };

            book2.bookedStatus = true;
            book2.customerName = order.customerName
            book2.date = order.date
            book2.startTime = order.startTime
            book2.endTime = order.endTime
            book2.bookingId = bookedHistory.length + 1;
            book2.bookingDate = new Date().toLocaleString();
            book2.bookingStatus = "successful";

            rooms.push(book2);
            bookedHistory.push(book2);
            res.status(200).send({ "room booked successfully": book2 })


        } else if (order.startTime > seletedRoom.endTime || order.endTime < seletedRoom.startTime) {

            if (order.endTime > order.startTime) {
                let book2 = { ...seletedRoom };

                book2.bookedStatus = true;
                book2.customerName = order.customerName
                book2.date = order.date
                book2.startTime = order.startTime
                book2.endTime = order.endTime
                book2.bookingId = bookedHistory.length + 1;
                book2.bookingDate = new Date().toLocaleString();
                book2.bookingStatus = "successful";

                rooms.push(book2);
                bookedHistory.push(book2);
                res.status(200).send({ "room booked successfully3": book2 })

            }
            else {
                res.status(400).send(`Sorry, Incorrect input please check booking time on ${order.date}`)
            }
        }
        else {
            res.status(400).send("Sorry, this Room not available at this time, please check with other room or other dates")
        }
    }
    else {
        res.status(400).send("Incorrect data")
    }
})


// 3. api for list all rooms with booked data
app.get("/rooms/all", (req, res) => {
    try {
        let result = rooms.map((val) => {

            if (!val.customerName) {

                return {
                    "roomName": val.roomName,
                    "bookedStatus": val.bookedStatus,
                    "customerName": " ",
                    "date": " ",
                    "startTime": " ",
                    "endTime": " ",
                }
            } else {
                return {
                    "roomName": val.roomName,
                    "bookedStatus": val.bookedStatus,
                    "customerName": val.customerName,
                    "date": val.date,
                    "startTime": val.startTime,
                    "endTime": val.endTime,
                }
            }

        });

        // console.log(result);
        res.status(200).send({ "All Rooms and Booked data": result });
    } catch (err) {
        res.status(400).send({ "error found": err })
    }
})


// 4. api for list all customers
app.get("/customer/all", (req, res) => {
    try {
        let result = bookedHistory.map((val) => {
            return {
                "customerName": val.customerName,
                "roomName": val.roomName,
                "date": val.date,
                "startTime": val.startTime,
                "endTime": val.endTime,
            }

        });

        // console.log(result);
        res.status(200).send({ "All customers and Booked data": result });
    } catch (err) {
        res.status(400).send({ "error found": err })
    }
})


// 5. api for get customer booked history with customer name
app.get("/customerhistory/:name", (req, res) => {
    let { name } = req.params
    let customerHistory = bookedHistory.filter((val) => val.customerName === name)
    // console.log(customerHistory);
    if (customerHistory.length >= 1) {

        let result = customerHistory.map((val) => {

            return {
                "customerName": val.customerName,
                "roomName": val.roomName,
                "date": val.date,
                "startTime": val.startTime,
                "endTime": val.endTime,
                "bookingId": val.bookingId,
                "bookingDate": val.bookingDate,
                "bookingStatus": val.bookingStatus,
            }

        })
        res.status(200).send({ "customer booked count": customerHistory.length, result });
    }
    else {
        res.status(400).send(`No History available for this customer, customer booked count: ${customerHistory.length}`);
    }
})

// for test
app.get("/", (req, res) => {
    res.send({ Message: "Server working good, add enpoint to get more" });
})

// listen and start a http server in 9001 port
app.listen(9001, () => console.log("Server started in localhost:9001"));