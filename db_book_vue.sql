/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MongoDB
 Source Server Version : 60001
 Source Host           : localhost:27017
 Source Schema         : db_book_vue

 Target Server Type    : MongoDB
 Target Server Version : 60001
 File Encoding         : 65001

 Date: 08/01/2024 15:38:23
*/


// ----------------------------
// Collection structure for identitycounters
// ----------------------------
db.getCollection("identitycounters").drop();
db.createCollection("identitycounters");

// ----------------------------
// Documents of identitycounters
// ----------------------------
db.getCollection("identitycounters").insert([ {
    _id: ObjectId("6587a5b7a563cb9fd09d61ad"),
    count: NumberInt("4"),
    model: "t_user",
    field: "_id",
    __v: NumberInt("0")
} ]);
db.getCollection("identitycounters").insert([ {
    _id: ObjectId("6587a5b7a563cb9fd09d61af"),
    count: NumberInt("1"),
    model: "t_admin",
    field: "_id",
    __v: NumberInt("0")
} ]);
db.getCollection("identitycounters").insert([ {
    _id: ObjectId("6587a5b7a563cb9fd09d61b1"),
    count: NumberInt("4"),
    model: "t_category",
    field: "_id",
    __v: NumberInt("0")
} ]);
db.getCollection("identitycounters").insert([ {
    _id: ObjectId("6587a5b7a563cb9fd09d61b3"),
    count: NumberInt("4"),
    model: "t_notice",
    field: "_id",
    __v: NumberInt("0")
} ]);
db.getCollection("identitycounters").insert([ {
    _id: ObjectId("6587a5b7a563cb9fd09d61b7"),
    count: NumberInt("6"),
    model: "t_book",
    field: "_id",
    __v: NumberInt("0")
} ]);
db.getCollection("identitycounters").insert([ {
    _id: ObjectId("6587a5b7a563cb9fd09d61b5"),
    count: NumberInt("2"),
    model: "t_configs",
    field: "_id",
    __v: NumberInt("0")
} ]);
db.getCollection("identitycounters").insert([ {
    _id: ObjectId("6587bb92b2c0b332985ecb33"),
    count: NumberInt("7"),
    model: "t_feedback",
    field: "_id",
    __v: NumberInt("0")
} ]);
db.getCollection("identitycounters").insert([ {
    _id: ObjectId("6587ea57d0408c57a0072d6e"),
    count: NumberInt("7"),
    model: "t_borrow",
    field: "_id",
    __v: NumberInt("0")
} ]);

// ----------------------------
// Collection structure for t_admin
// ----------------------------
db.getCollection("t_admin").drop();
db.createCollection("t_admin");

// ----------------------------
// Documents of t_admin
// ----------------------------
db.getCollection("t_admin").insert([ {
    _id: NumberInt("1"),
    username: "admin",
    password: "123456",
    nickname: "Admin",
    createTime: ISODate("2023-12-24T03:30:17.58Z"),
    updateTime: ISODate("2023-12-24T03:30:17.58Z")
} ]);

// ----------------------------
// Collection structure for t_book
// ----------------------------
db.getCollection("t_book").drop();
db.createCollection("t_book");

// ----------------------------
// Documents of t_book
// ----------------------------
db.getCollection("t_book").insert([ {
    _id: NumberInt("1"),
    category: NumberInt("1"),
    isbn: "B0001",
    bookName: "Romance of the Three Kingdoms",
    author: "Luo Guanzhong",
    price: NumberInt("20"),
    cover: "http://localhost:8080/files/book/1703667188066.jpg",
    status: NumberInt("0"),
    remark: "Romance of the Three Kingdoms (traditional Chinese: 三國演義; simplified Chinese: 三国演义; pinyin: Sānguó Yǎnyì) is a 14th-century historical novel attributed to Luo Guanzhong. It is set in the turbulent years towards the end of the Han dynasty and the Three Kingdoms period in Chinese history, starting in 184 AD and ending with the reunification of the land in 280 by the Western Jin. The novel is based primarily on the Records of the Three Kingdoms, written by Chen Shou in the 3rd century.",
    createTime: ISODate("2023-12-24T11:43:54.000Z"),
    updateTime: ISODate("2023-12-27T16:53:09.000Z"),
    press: "Tsinghua University Press"
} ]);
db.getCollection("t_book").insert([ {
    _id: NumberInt("2"),
    category: NumberInt("1"),
    isbn: "B0002",
    bookName: "Journey to the West",
    author: "Wu Cheng'en",
    price: NumberInt("20"),
    press: "Tsinghua University Press",
    cover: "http://localhost:8080/files/book/1703812709121.jpg",
    status: NumberInt("0"),
    remark: "Journey to the West (Chinese: 西遊記) is a Chinese novel published in the 16th century during the Ming dynasty and attributed to Wu Cheng'en. It is regarded as one of the greatest Classic Chinese Novels, and has been described as arguably the most popular literary work in East Asia.Arthur Waley's 1942 abridged translation, Monkey, is known in English-speaking countries.",
    createTime: ISODate("2023-12-29T09:19:25.000Z"),
    updateTime: ISODate("2023-12-29T09:19:25.000Z")
} ]);
db.getCollection("t_book").insert([ {
    _id: NumberInt("3"),
    category: NumberInt("2"),
    isbn: "B0003",
    bookName: "Elon Musk: by Walter Isaacson",
    author: "Walter Isaacson",
    price: NumberInt("20"),
    press: "Simon & Schuster.",
    cover: "http://localhost:8080/files/book/1704172719144.jpg",
    status: NumberInt("0"),
    remark: "Elon Musk is an authorized biography of American business magnate and SpaceX/Tesla CEO Elon Musk. The book was written by Walter Isaacson, a former executive at CNN, TIME and the Aspen Institute who had previously written best-selling biographies of Benjamin Franklin, Albert Einstein, Steve Jobs and Leonardo Da Vinci. The book was published on September 12, 2023, by Simon & Schuster.",
    createTime: ISODate("2024-01-02T13:18:46.000Z"),
    updateTime: ISODate("2024-01-02T13:18:46.000Z")
} ]);
db.getCollection("t_book").insert([ {
    _id: 4,
    category: 3,
    isbn: "B0004",
    bookName: "The Art of War",
    author: "\tSun Tzu",
    price: 20,
    cover: "http://localhost:8080/files/book/theArtOfWar.jpg",
    remark: "The Art of War (Chinese: 孫子兵法; pinyin: Sūnzǐ bīngfǎ; lit. 'Sun Tzu's Military Method') is an ancient Chinese military treatise dating from the Late Spring and Autumn Period (roughly 5th century BC). The work, which is attributed to the ancient Chinese military strategist Sun Tzu (\"Master Sun\"), is composed of 13 chapters. Each one is devoted to a different set of skills or art related to warfare and how it applies to military strategy and tactics. For almost 1,500 years, it was the lead text in an anthology that was formalized as the Seven Military Classics by Emperor Shenzong of Song in 1080. The Art of War remains the most influential strategy text in East Asian warfare,has influenced both East Asian and Western military theory and thinking, and has found a variety of applications in a myriad of competitive non-military endeavors across the modern world including espionage,culture, politics, business, and sports.",
    status: 0,
    createTime: ISODate("2024-01-04T14:10:11.000Z"),
    updateTime: ISODate("2024-01-04T14:10:11.000Z"),
    press: "Beijing University Press"
} ]);
db.getCollection("t_book").insert([ {
    _id: 5,
    category: 4,
    isbn: "B0005",
    bookName: "Bencao Gangmu",
    author: "Li Shizhen",
    price: 20,
    cover: "http://localhost:8080/files/book/bcgm.jpg",
    remark: "The Bencao gangmu, known in English as the Compendium of Materia Medica or Great Pharmacopoeia,is an encyclopedic gathering of medicine, natural history, and Chinese herbology compiled and edited by Li Shizhen and published in the late 16th century, during the Ming dynasty. Its first draft was completed in 1578 and printed in Nanjing in 1596. The Compendium lists the materia medica of traditional Chinese medicine known at the time, including plants, animals, and minerals that were believed to have medicinal properties.",
    status: NumberInt("0"),
    createTime: ISODate("2024-01-04T14:19:32.000Z"),
    updateTime: ISODate("2024-01-04T14:19:32.000Z"),
    press: "Beijing University Press"
} ]);
db.getCollection("t_book").insert([ {
    _id: NumberInt("6"),
    category: NumberInt("1"),
    isbn: "1984",
    bookName: "1984",
    author: "George Orwell",
    price: NumberInt("30"),
    press: "Secker & Warburg",
    cover: "http://localhost:8080/files/book/1704645236540.jpg",
    status: NumberInt("0"),
    remark: "George Orwell",
    createTime: ISODate("2024-01-08T00:35:26.000Z"),
    updateTime: ISODate("2024-01-08T00:35:26.000Z")
} ]);

// ----------------------------
// Collection structure for t_borrow
// ----------------------------
db.getCollection("t_borrow").drop();
db.createCollection("t_borrow");

// ----------------------------
// Documents of t_borrow
// ----------------------------
db.getCollection("t_borrow").insert([ {
    _id: NumberInt("1"),
    user: NumberInt("1"),
    book: NumberInt("1"),
    beginTime: "2023-12-24",
    duration: NumberInt("0"),
    status: NumberInt("1"),
    createTime: ISODate("2023-12-24T16:28:14.000Z"),
    updateTime: ISODate("2023-12-24T16:28:14.000Z"),
    endTime: "2024-01-02"
} ]);
db.getCollection("t_borrow").insert([ {
    _id: NumberInt("2"),
    user: NumberInt("1"),
    book: NumberInt("2"),
    beginTime: "2023-10-29",
    endTime: "2024-01-02",
    duration: NumberInt("0"),
    remark: "Lend 1 mouth",
    status: NumberInt("1"),
    createTime: ISODate("2023-12-29T09:39:09.000Z"),
    updateTime: ISODate("2023-12-29T09:39:09.000Z")
} ]);
db.getCollection("t_borrow").insert([ {
    _id: NumberInt("3"),
    user: NumberInt("4"),
    book: NumberInt("3"),
    beginTime: "2024-01-02",
    endTime: "2024-01-02",
    duration: NumberInt("0"),
    remark: "Lend 1 mouth",
    status: NumberInt("1"),
    createTime: ISODate("2024-01-02T13:21:25.000Z"),
    updateTime: ISODate("2024-01-02T13:21:25.000Z")
} ]);
db.getCollection("t_borrow").insert([ {
    _id: NumberInt("4"),
    user: NumberInt("1"),
    book: NumberInt("3"),
    beginTime: "2024-01-05",
    endTime: "2024-01-05",
    duration: NumberInt("0"),
    remark: "lend",
    status: NumberInt("1"),
    createTime: ISODate("2024-01-05T22:08:38.000Z"),
    updateTime: ISODate("2024-01-05T22:08:38.000Z")
} ]);
db.getCollection("t_borrow").insert([ {
    _id: NumberInt("5"),
    user: NumberInt("2"),
    book: NumberInt("6"),
    beginTime: "2024-01-08",
    endTime: "2024-01-08",
    duration: NumberInt("0"),
    remark: "1 mouth",
    status: NumberInt("1"),
    createTime: ISODate("2024-01-08T13:08:09.000Z"),
    updateTime: ISODate("2024-01-08T13:08:09.000Z")
} ]);
db.getCollection("t_borrow").insert([ {
    _id: NumberInt("6"),
    user: NumberInt("2"),
    book: NumberInt("5"),
    beginTime: "2024-01-08",
    endTime: "2024-01-08",
    duration: NumberInt("1"),
    remark: "3 mouth",
    status: NumberInt("1"),
    createTime: ISODate("2024-01-08T13:08:21.000Z"),
    updateTime: ISODate("2024-01-08T13:08:21.000Z")
} ]);
db.getCollection("t_borrow").insert([ {
    _id: NumberInt("7"),
    user: NumberInt("1"),
    book: NumberInt("3"),
    beginTime: "2024-01-08",
    endTime: "2024-01-08",
    duration: NumberInt("0"),
    remark: "1 mouth",
    status: NumberInt("1"),
    createTime: ISODate("2024-01-08T13:37:10.000Z"),
    updateTime: ISODate("2024-01-08T13:37:10.000Z")
} ]);

// ----------------------------
// Collection structure for t_category
// ----------------------------
db.getCollection("t_category").drop();
db.createCollection("t_category");

// ----------------------------
// Documents of t_category
// ----------------------------
db.getCollection("t_category").insert([ {
    _id: NumberInt("1"),
    categoryName: "Novel",
    remark: "Novel book",
    createTime: ISODate("2023-12-24T11:40:26.000Z"),
    updateTime: ISODate("2023-12-24T11:40:33.000Z")
} ]);
db.getCollection("t_category").insert([ {
    _id: NumberInt("2"),
    categoryName: "Science",
    remark: "Science book",
    createTime: ISODate("2023-12-29T09:13:54.000Z"),
    updateTime: ISODate("2023-12-29T09:13:59.000Z")
} ]);
db.getCollection("t_category").insert([ {
    _id: NumberInt("3"),
    categoryName: "Military",
    remark: "Military book",
    createTime: ISODate("2023-12-29T09:14:12.000Z"),
    updateTime: ISODate("2024-01-02T13:17:45.000Z")
} ]);
db.getCollection("t_category").insert([ {
    _id: NumberInt("4"),
    categoryName: "Medicine",
    remark: "Medicine book",
    createTime: ISODate("2024-01-02T13:17:38.000Z"),
    updateTime: ISODate("2024-01-02T13:17:38.000Z")
} ]);

// ----------------------------
// Collection structure for t_configs
// ----------------------------
db.getCollection("t_configs").drop();
db.createCollection("t_configs");

// ----------------------------
// Documents of t_configs
// ----------------------------
db.getCollection("t_configs").insert([ {
    _id: NumberInt("1"),
    code: "maxNum",
    name: "Maximum borrowing quantity",
    value: "4",
    createTime: ISODate("2023-12-24T03:33:36.265Z"),
    updateTime: ISODate("2024-01-08T13:57:46.000Z")
} ]);
db.getCollection("t_configs").insert([ {
    _id: NumberInt("2"),
    code: "deduct",
    name: "Deduction of overdue fees/day",
    value: "1",
    createTime: ISODate("2023-12-24T03:34:30.753Z"),
    updateTime: ISODate("2024-01-02T13:19:48.000Z")
} ]);

// ----------------------------
// Collection structure for t_feedback
// ----------------------------
db.getCollection("t_feedback").drop();
db.createCollection("t_feedback");

// ----------------------------
// Documents of t_feedback
// ----------------------------
db.getCollection("t_feedback").insert([ {
    _id: NumberInt("2"),
    user: NumberInt("1"),
    title: "Do we need to deduct fees for overdue payments?",
    content: "Do we need to deduct fees for overdue payments?",
    status: NumberInt("1"),
    reply: "Yes, one pound a day",
    createTime: ISODate("2024-01-02T10:50:23.000Z"),
    updateTime: ISODate("2024-01-02T13:19:28.000Z")
} ]);
db.getCollection("t_feedback").insert([ {
    _id: NumberInt("3"),
    user: NumberInt("4"),
    title: "Can I change my password?",
    content: "Can I change my password?How",
    status: NumberInt("0"),
    reply: "",
    createTime: ISODate("2024-01-02T13:21:51.000Z"),
    updateTime: ISODate("2024-01-02T13:21:51.000Z")
} ]);
db.getCollection("t_feedback").insert([ {
    _id: NumberInt("5"),
    user: NumberInt("1"),
    title: "HI",
    content: "Hi",
    status: NumberInt("0"),
    reply: "",
    createTime: ISODate("2024-01-08T13:38:10.000Z"),
    updateTime: ISODate("2024-01-08T13:38:10.000Z")
} ]);
db.getCollection("t_feedback").insert([ {
    _id: NumberInt("6"),
    user: NumberInt("2"),
    title: "111",
    content: "111",
    status: NumberInt("1"),
    reply: "111",
    createTime: ISODate("2024-01-08T13:41:01.000Z"),
    updateTime: ISODate("2024-01-08T13:42:09.000Z")
} ]);
db.getCollection("t_feedback").insert([ {
    _id: NumberInt("7"),
    user: NumberInt("2"),
    title: "111",
    content: "111",
    status: NumberInt("1"),
    reply: "123",
    createTime: ISODate("2024-01-08T13:46:40.000Z"),
    updateTime: ISODate("2024-01-08T13:49:37.000Z")
} ]);

// ----------------------------
// Collection structure for t_notice
// ----------------------------
db.getCollection("t_notice").drop();
db.createCollection("t_notice");

// ----------------------------
// Documents of t_notice
// ----------------------------
db.getCollection("t_notice").insert([ {
    _id: NumberInt("1"),
    title: "The library management system is online now",
    content: "<p>The library management system is online now</p>",
    createTime: ISODate("2023-12-24T11:42:34.000Z"),
    updateTime: ISODate("2023-12-24T11:42:53.000Z")
} ]);
db.getCollection("t_notice").insert([ {
    _id: NumberInt("2"),
    title: "Upgrade and maintenance of library management",
    content: "<p>Upgrading and maintaining library management, please stay tuned.</p>",
    createTime: ISODate("2023-12-29T09:13:09.000Z"),
    updateTime: ISODate("2024-01-02T13:19:38.000Z")
} ]);
db.getCollection("t_notice").insert([ {
    _id: NumberInt("3"),
    title: "111",
    content: "<p>111</p>",
    createTime: ISODate("2024-01-08T13:42:04.000Z"),
    updateTime: ISODate("2024-01-08T13:42:04.000Z")
} ]);
db.getCollection("t_notice").insert([ {
    _id: NumberInt("4"),
    title: "123",
    content: "<p>123</p>",
    createTime: ISODate("2024-01-08T13:49:49.000Z"),
    updateTime: ISODate("2024-01-08T13:49:49.000Z")
} ]);

// ----------------------------
// Collection structure for t_user
// ----------------------------
db.getCollection("t_user").drop();
db.createCollection("t_user");

// ----------------------------
// Documents of t_user
// ----------------------------
db.getCollection("t_user").insert([ {
    _id: NumberInt("1"),
    username: "2023001",
    password: "123456",
    nickname: "Jessica",
    telephone: "11111111111",
    email: "1111@qq.com",
    sex: NumberInt("1"),
    birthday: "2001-06-05",
    profession: "Computer",
    address: "Plymouth",
    amount: NumberInt("932"),
    status: NumberInt("0"),
    createTime: ISODate("2023-12-24T11:39:37.000Z"),
    updateTime: ISODate("2024-01-02T10:57:02.000Z"),
    avatar: "http://localhost:8080/files/avatar/1703666894031.jpg"
} ]);
db.getCollection("t_user").insert([ {
    _id: NumberInt("2"),
    username: "2023002",
    password: "123456",
    nickname: "Marry",
    telephone: "11111111112",
    email: "1112@qq.com",
    sex: NumberInt("1"),
    birthday: "2001-06-13",
    profession: "Computer",
    address: "Plymouth",
    amount: NumberInt("1000"),
    status: NumberInt("0"),
    createTime: ISODate("2023-12-27T22:46:33.000Z"),
    updateTime: ISODate("2023-12-27T22:48:30.000Z"),
    avatar: "http://localhost:8080/files/avatar/1703688509394.jpg"
} ]);
db.getCollection("t_user").insert([ {
    _id: NumberInt("3"),
    username: "2023003",
    password: "123456",
    nickname: "Jack",
    telephone: "11111111113",
    email: "1113@qq.com",
    sex: NumberInt("0"),
    birthday: "2001-10-16",
    profession: "Information engineering",
    address: "Plymouth",
    amount: NumberInt("100"),
    status: NumberInt("0"),
    createTime: ISODate("2023-12-28T19:12:01.000Z"),
    updateTime: ISODate("2024-01-02T13:15:55.000Z"),
    avatar: null
} ]);
db.getCollection("t_user").insert([ {
    _id: NumberInt("4"),
    username: "2023004",
    password: "123456",
    nickname: "Janey",
    telephone: "11111111114",
    email: "1114@qq.com",
    sex: NumberInt("1"),
    birthday: "1999-09-21",
    profession: "Computer",
    address: "Plymouth",
    amount: NumberInt("100"),
    status: NumberInt("0"),
    createTime: ISODate("2024-01-02T13:17:11.000Z"),
    updateTime: ISODate("2024-01-02T13:20:38.000Z"),
    avatar: "http://localhost:8080/files/avatar/1704172837770.jpg"
} ]);
