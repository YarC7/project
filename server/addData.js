const { MongoClient } = require('mongodb');

async function main() {
    const uri = `mongodb+srv://canh177:canhga177@loser123.u1pzcor.mongodb.net/?retryWrites=true&w=majority`
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('shoppingonline');
        const collection = database.collection('classes');

        // Logic tăng dần cho room và stair
        async function addRoomStairData(room, stair, zone, building, maxRoom = 30) {
            const document = {
                room: room.toString().padStart(2, '0'),
                stair: stair.toString().padStart(2, '0'),
                zone: zone,
                building: building
            };
            await collection.insertOne(document);
            console.log(`Added: ${JSON.stringify(document)}`);
            room += 1;
            if (room > maxRoom) {
                room = 1;
                stair += 1;
            }
            return { room, stair };
        }

        // Giá trị khởi tạo
        let room = 1;
        let stair = 1;
        const zone = "G";
        const building = "A";

        // Thêm dữ liệu ví dụ
        const numEntries = 20; // Số lần thêm dữ liệu
        for (let i = 0; stair < 13; i++) {
            ({ room, stair } = await addRoomStairData(room, stair, zone, building));
        }
    } finally {
        await client.close();
    }
}

main().catch(console.error);
