const { MongoClient } = require("mongodb");

// Replace this with your MongoDB Atlas connection string
const uri = "mongodb+srv://dmmatos:Daniel2912@cluster0.ng5xfob.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri);

async function main() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

       await deleteListingScrapedBeforeDate(client, new Date("2019-02-15"));    


    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
        console.log("Disconnected from MongoDB");
    }
}

main();

async function deleteListingScrapedBeforeDate(client, date) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .deleteMany({ last_scraped: { $lt: date } });

    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function deleteListingByName(client, nameOfListing) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .deleteOne({ name: nameOfListing });

    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function updateAllListingsToHavePropertyType(client) {    
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .updateMany(
            { property_type: { $exists: false } },
            { $set: { property_type: "Unknown" } }
        );

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}   

async function upsertListingByName(client, nameOfListing, updatedListing) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .updateOne(
            { name: nameOfListing },
            { $set: updatedListing },
            { upsert: true }
        );
        
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated.`);
    }
}


async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log(` - ${db.name}`);
    });
}

async function findOneListingByName(client, nameOfListing) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing named "${nameOfListing}":`);
        console.log(result);
    } else {
        console.log(`No listings found with the name "${nameOfListing}".`);
    }
}

async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .updateOne(
            { name: nameOfListing },
            { $set: updatedListing }
        );

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function createListing(client, newListing) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .insertOne(newListing);

    console.log(`New listing created with id: ${result.insertedId}`);
}

async function createMultipleListings(client, newListings) {
    const result = await client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .insertMany(newListings);

    console.log(`${result.insertedCount} new listings created.`);
    console.log(result.insertedIds);
}

async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(
    client,
    {
        minimumNumberOfBedrooms = 0,
        minimumNumberOfBathrooms = 0,
        maximumNumberOfResults = Number.MAX_SAFE_INTEGER
    } = {}
) {
    const cursor = client
        .db("sample_airbnb")
        .collection("listingsAndReviews")
        .find({
            bedrooms: { $gte: minimumNumberOfBedrooms },
            bathrooms: { $gte: minimumNumberOfBathrooms }
        })
        .sort({ last_review: -1 })
        .limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(
            `Found ${results.length} listing(s):`
        );

        results.forEach((result, i) => {
            console.log(`\n${i + 1}. ${result.name}`);
            console.log(`   ID: ${result._id}`);
            console.log(`   Bedrooms: ${result.bedrooms}`);
            console.log(`   Bathrooms: ${result.bathrooms}`);
            console.log(`   Last Review: ${new Date(result.last_review).toDateString()}`);
        });
    } else {
        console.log("No listings found.");
    }
}