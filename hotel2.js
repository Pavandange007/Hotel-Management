class Customer {
    constructor() {
        this.name = '';
        this.surname = '';
        this.checkin = '';
        this.checkout = '';
        this.guests = 0;
        this.bill = 0;
        this.days = 0;
        this.gst = 0;
        this.total = 0;
        this.roomstat = 0;
        this.contact = 0;
    }
}

class HotelManagement {
    constructor() {
        this.customers = Array(15).fill(null).map(() => new Customer());
    }

    available() {
        const nonac = this.nonac();
        const ac = this.ac();
        const premium = this.premium();

        return { nonac, ac, premium };
    }

    nonac() {
        return this.customers.slice(0, 5).map((customer, index) => customer.roomstat === 0 ? index + 1 : null).filter(room => room !== null);
    }

    ac() {
        return this.customers.slice(5, 10).map((customer, index) => customer.roomstat === 0 ? index + 6 : null).filter(room => room !== null);
    }

    premium() {
        return this.customers.slice(10, 15).map((customer, index) => customer.roomstat === 0 ? index + 11 : null).filter(room => room !== null);
    }

    checkin(roomtype, room, details) {
        const r = room - 1;
        if (this.customers[r].roomstat === 1) {
            throw new Error('Room Occupied.');
        } else if ((roomtype === 1 && (room < 6 || room > 10)) ||
            (roomtype === 2 && (room < 1 || room > 5)) ||
            (roomtype === 3 && (room < 11 || room > 15))) {
            throw new Error('Invalid room choice.');
        } else {
            this.customers[r].roomstat = 1;
            this.customers[r].bill = roomtype === 1 ? 2500 : roomtype === 2 ? 2000 : 3000;
            this.customers[r] = { ...this.customers[r], ...details };
        }
    }

    search(room) {
        const r = room - 1;
        if (this.customers[r].roomstat === 1) {
            return this.customers[r];
        } else {
            throw new Error('Room is unoccupied.');
        }
    }

    checkout(room) {
        const r = room - 1;
        if (this.customers[r].roomstat === 0) {
            throw new Error('Room is unoccupied.');
        } else {
            const billDetails = this.getBill(r);
            this.customers[r].roomstat = 0;
            return billDetails;
        }
    }

    getBill(r) {
        this.calculate(r);
        return this.customers[r];
    }

    calculate(r) {
        this.customers[r].bill *= this.customers[r].days;
        this.customers[r].gst = this.customers[r].bill * 0.12;
        this.customers[r].total = this.customers[r].bill + this.customers[r].gst;
    }

    guestlist() {
        return this.customers.filter(c => c.roomstat === 1);
    }
}

const hotel = new HotelManagement();

function showAvailability() {
    const available = hotel.available();
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Available Rooms</h2>
        <p>Non-AC rooms: ${available.nonac.join(', ')}</p>
        <p>AC rooms: ${available.ac.join(', ')}</p>
        <p>Premium rooms: ${available.premium.join(', ')}</p>
    `;
}

function showCheckinForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Check-In</h2>
        <form id="checkinForm">
            <label for="roomtype">Room Type:</label>
            <select name="roomtype" id="roomtype">
                <option value="1">AC - Rs. 2500</option>
                <option value="2">NonAC - Rs. 2000</option>
                <option value="3">Premium - Rs. 3000</option>
            </select>
            <label for="room">Room Number:</label>
            <input type="number" name="room" id="room" required>
            <label for="name">First Name:</label>
            <input type="text" name="name" id="name" required>
            <label for="surname">Surname:</label>
            <input type="text" name="surname" id="surname" required>
            <label for="days">Number of Days:</label>
            <input type="number" name="days" id="days" required>
            <label for="checkin">Check-In Date (DD/MM/YYYY):</label>
            <input type="text" name="checkin" id="checkin" required>
            <label for="checkout">Check-Out Date (DD/MM/YYYY):</label>
            <input type="text" name="checkout" id="checkout" required>
            <label for="guests">Number of Guests:</label>
            <input type="number" name="guests" id="guests" required>
            <label for="contact">Contact Number:</label>
            <input type="text" name="contact" id="contact" required>
            <button type="submit">Check-In</button>
        </form>
        <div id="message"></div>
    `;

    document.getElementById('checkinForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const roomtype = parseInt(document.getElementById('roomtype').value);
        const room = parseInt(document.getElementById('room').value);
        const name = document.getElementById('name').value;
        const surname = document.getElementById('surname').value;
        const days = parseInt(document.getElementById('days').value);
        const checkin = document.getElementById('checkin').value;
        const checkout = document.getElementById('checkout').value;
        const guests = parseInt(document.getElementById('guests').value);
        const contact = document.getElementById('contact').value;

        try {
            hotel.checkin(roomtype, room, { name, surname, days, checkin, checkout, guests, contact });
            document.getElementById('message').innerText = 'Room booked successfully!';
            document.getElementById('message').style.color = 'green';
        } catch (error) {
            document.getElementById('message').innerText = error.message;
            document.getElementById('message').style.color = 'red';
        }
    });
}

function showSearchForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Search Room</h2>
        <form id="searchForm">
            <label for="room">Room Number:</label>
            <input type="number" name="room" id="room" required>
            <button type="submit">Search</button>
        </form>
        <div id="message"></div>
    `;

    document.getElementById('searchForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const room = parseInt(document.getElementById('room').value);

        try {
            const customer = hotel.search(room);
            document.getElementById('message').innerHTML = `
                <p>Room is occupied by ${customer.name} ${customer.surname}</p>
                <p>Check-in date: ${customer.checkin}</p>
                <p>Check-out date: ${customer.checkout}</p>
                <p>Number of guests: ${customer.guests}</p>
                <p>Contact number: ${customer.contact}</p>
            `;
        } catch (error) {
            document.getElementById('message').innerText = error.message;
            document.getElementById('message').style.color = 'red';
        }
    });
}

function showCheckoutForm() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Check-Out</h2>
        <form id="checkoutForm">
            <label for="room">Room Number:</label>
            <input type="number" name="room" id="room" required>
            <button type="submit">Check-Out</button>
        </form>
        <div id="message"></div>
    `;

    document.getElementById('checkoutForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const room = parseInt(document.getElementById('room').value);

        try {
            const billDetails = hotel.checkout(room);
            document.getElementById('message').innerHTML = `
                <p>Guest: ${billDetails.name} ${billDetails.surname}</p>
                <p>Days Stayed: ${billDetails.days}</p>
                <p>Room Bill: Rs. ${billDetails.bill}</p>
                <p>GST (12%): Rs. ${billDetails.gst}</p>
                <p>Total Bill: Rs. ${billDetails.total}</p>
            `;
        } catch (error) {
            document.getElementById('message').innerText = error.message;
            document.getElementById('message').style.color = 'red';
        }
    });
}

function showGuestList() {
    const guestlist = hotel.guestlist();
    const content = document.getElementById('content');
    content.innerHTML = `
        <h2>Guest List</h2>
        <ul>
            ${guestlist.map(guest => `<li>${guest.name} ${guest.surname} - Room: ${guest.roomstat + 1}</li>`).join('')}
        </ul>
    `;
}
