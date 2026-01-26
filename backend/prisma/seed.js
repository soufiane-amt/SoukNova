"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var products = require('./seed-data/products_full.json');
var articles = require('./seed-data/articles_full.json');
var users = require('./seed-data/dummy_users.json');
var sampleSentences = [
    'Ut maiores eos sit molestias ipsam. Hic maxime ea. Molestiae quas perspiciatis eaque iusto voluptatibus. Quas labore reiciendis voluptatum. Natus ipsa sequi quae aperiam beatae impedit perferendis. Tenetur nisi dignissimos nemo totam deleniti.\nExercitationem accusantium placeat enim nobis ut debitis quos rem. Aperiam aliquam iusto. Id veniam officia consectetur nam porro voluptates. Quibusdam eaque asperiores.\nMagni rem ab architecto corporis iste. Tempore esse perspiciatis deserunt distinctio incidunt recusandae. Odit facilis temporibus fugiat fugiat similique earum ratione. In aliquid possimus quaerat dignissimos. Laboriosam illo ipsam est.',
    'Dolorem perspiciatis nobis tempora impedit asperiores voluptate inventore quasi nostrum. Repellendus esse hic corrupti nemo quasi. Asperiores expedita quo quis unde reiciendis nulla vitae. Placeat ad rerum itaque voluptas beatae aliquam quis ipsam.',
    'Quia ipsa velit neque placeat dicta veritatis explicabo atque aut.\nNulla ea distinctio id accusantium.\nConsequuntur alias deserunt nemo voluptatem veritatis velit quidem.',
    'Molestiae quasi aspernatur atque. Quisquam eveniet magni. Quisquam cumque laboriosam. Quisquam dolores nostrum. Quisquam dicta beatae. Quisquam debitis itaque.',
    'Cupiditate exercitationem dolor exercitationem odio.\nMagnam dolorum repellendus fugit at.\nFugit veritatis natus.\nMaiores iste quam aspernatur.',
    'Minus consequatur exercitationem cum dolorum. Quo cupiditate voluptates modi porro vero. Neque nesciunt magnam.',
    'Et voluptatibus et non laborum numquam earum. Modi numquam commodi dolore beatae at. Deserunt ratione nemo totam dolor quae mollitia eveniet. Dignissimos adipisci harum veritatis modi dolores est ea rem perferendis.',
    'Laborum voluptas accusamus voluptates.',
    'Autem a saepe reprehenderit laudantium consequatur fugiat ipsam quam. Corporis vero veritatis facilis sunt aut quod asperiores. Atque sunt nesciunt eos itaque reprehenderit.\nUnde nam ex ullam. Iste in occaecati provident neque sint non amet eos ipsam. Explicabo quibusdam aut hic odio modi.\nEx impedit omnis veniam nemo. Pariatur repellendus iusto voluptates rerum. Dicta placeat totam. Ratione voluptatem numquam officiis sequi quidem laboriosam. Tenetur explicabo non reiciendis quidem facilis illo enim nobis. Minima veritatis voluptatem voluptate.',
    'Quo porro repudiandae ipsa voluptatem facilis cum fugit sit. Iure aut eveniet occaecati a fugiat. Optio nulla saepe aspernatur facere modi provident. Asperiores neque fuga accusamus id placeat eligendi vel qui. Quam quo ad ipsam labore similique voluptatum aspernatur hic earum.',
];
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var productCount, productData, dbUsers, dbProducts, userIds, productIds, commentsData_1, batchSize, i, batch, ratingGroups, articleCount, articleData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Start seeding ...');
                    console.log('Creating users...');
                    return [4 /*yield*/, prisma.user.createMany({ data: users, skipDuplicates: true })];
                case 1:
                    _a.sent();
                    console.log('Users created.');
                    return [4 /*yield*/, prisma.product.count()];
                case 2:
                    productCount = _a.sent();
                    if (!(productCount > 0)) return [3 /*break*/, 3];
                    console.log('Products already exist. Skipping product creation.');
                    return [3 /*break*/, 5];
                case 3:
                    productData = products.map(function (product) { return (__assign(__assign({}, product), { images: product.images || [], colors: product.colors || [], categories: product.categories || [] })); });
                    console.log('Creating products...');
                    return [4 /*yield*/, prisma.product.createMany({
                            data: productData,
                            skipDuplicates: true,
                        })];
                case 4:
                    _a.sent();
                    console.log('Products created.');
                    _a.label = 5;
                case 5: return [4 /*yield*/, prisma.user.findMany({
                        where: { email: { in: users.map(function (u) { return u.email; }) } },
                    })];
                case 6:
                    dbUsers = _a.sent();
                    return [4 /*yield*/, prisma.product.findMany({
                            select: { id: true, title: true },
                        })];
                case 7:
                    dbProducts = _a.sent();
                    if (!(dbUsers.length > 0 && dbProducts.length > 0)) return [3 /*break*/, 17];
                    console.log('Preparing comments for products by test users...');
                    userIds = dbUsers.map(function (u) { return u.id; });
                    productIds = dbProducts.map(function (p) { return p.id; });
                    // remove any existing comments from these users on these products to keep seeding idempotent
                    return [4 /*yield*/, prisma.comment.deleteMany({
                            where: { userId: { in: userIds }, productId: { in: productIds } },
                        })];
                case 8:
                    // remove any existing comments from these users on these products to keep seeding idempotent
                    _a.sent();
                    commentsData_1 = [];
                    dbProducts.forEach(function (product, pIdx) {
                        dbUsers.forEach(function (user, uIdx) {
                            // make rating between 1 and 5 randomly
                            var rating = Math.floor(Math.random() * 5) + 1;
                            var sentence = sampleSentences[(pIdx + uIdx) % sampleSentences.length];
                            var content = "".concat(sentence, " (product: ").concat(product.title, ")");
                            var addedAt = new Date(Date.now() - (pIdx * dbUsers.length + uIdx) * 1000);
                            commentsData_1.push({
                                userId: user.id,
                                productId: product.id,
                                content: content,
                                rating: rating,
                                addedAt: addedAt,
                            });
                        });
                    });
                    console.log("Creating ".concat(commentsData_1.length, " comments..."));
                    batchSize = 500;
                    i = 0;
                    _a.label = 9;
                case 9:
                    if (!(i < commentsData_1.length)) return [3 /*break*/, 12];
                    batch = commentsData_1.slice(i, i + batchSize);
                    return [4 /*yield*/, prisma.comment.createMany({ data: batch })];
                case 10:
                    _a.sent();
                    _a.label = 11;
                case 11:
                    i += batchSize;
                    return [3 /*break*/, 9];
                case 12:
                    console.log('Comments created.');
                    // compute average rating per product from comments and update product.rate
                    console.log('Computing product ratings from comments...');
                    return [4 /*yield*/, prisma.comment.groupBy({
                            by: ['productId'],
                            _avg: { rating: true },
                        })];
                case 13:
                    ratingGroups = _a.sent();
                    if (!(ratingGroups && ratingGroups.length > 0)) return [3 /*break*/, 15];
                    return [4 /*yield*/, Promise.all(ratingGroups.map(function (g) {
                            var _a, _b;
                            var avg = (_b = (_a = g._avg) === null || _a === void 0 ? void 0 : _a.rating) !== null && _b !== void 0 ? _b : null;
                            if (avg === null)
                                return Promise.resolve(null);
                            var rounded = Math.round(avg);
                            return prisma.product.update({
                                where: { id: g.productId },
                                data: { rate: rounded },
                            });
                        }))];
                case 14:
                    _a.sent();
                    console.log("Updated ".concat(ratingGroups.length, " product rates."));
                    return [3 /*break*/, 16];
                case 15:
                    console.log('No ratings found to update products.');
                    _a.label = 16;
                case 16: return [3 /*break*/, 18];
                case 17:
                    console.log('No users or products found to create comments.');
                    _a.label = 18;
                case 18: return [4 /*yield*/, prisma.article.count()];
                case 19:
                    articleCount = _a.sent();
                    if (!(articleCount > 0)) return [3 /*break*/, 20];
                    console.log('Articles already exist. Skipping article creation.');
                    return [3 /*break*/, 22];
                case 20:
                    articleData = articles.map(function (article) {
                        var _a, _b, _c;
                        return ({
                            title: (_a = article.title) !== null && _a !== void 0 ? _a : 'No title',
                            author: (_b = article.author) !== null && _b !== void 0 ? _b : 'Unknown',
                            images: article.images || [],
                            date: (_c = article.date) !== null && _c !== void 0 ? _c : '',
                            text: (article.article_paragraphs || []).join('\n'),
                        });
                    });
                    console.log('Creating articles...');
                    return [4 /*yield*/, prisma.article.createMany({
                            data: articleData,
                            skipDuplicates: true,
                        })];
                case 21:
                    _a.sent();
                    console.log('Articles created.');
                    _a.label = 22;
                case 22:
                    console.log('Seeding finished.');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
