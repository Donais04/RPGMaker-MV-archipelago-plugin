if (typeof window.structuredClone !== "function") {
    window.structuredClone = (function () {
        function clone(value, seen) {
            if (value === null || typeof value !== "object") {
                return value;
            }

            if (!seen) seen = [];
            for (var i = 0; i < seen.length; i++) {
                if (seen[i].source === value) {
                    return seen[i].copy;
                }
            }

            var copy;
            if (Array.isArray(value)) {
                copy = [];
            } else {
                copy = {};
            }

            seen.push({ source: value, copy: copy });

            for (var key in value) {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    copy[key] = clone(value[key], seen);
                }
            }

            return copy;
        }

        return function structuredClonePolyfill(obj) {
            return clone(obj, []);
        };
    })();
}

Array.prototype.toSorted = function(f) { const a = Array.from(this); a.sort(f); return a; }



var i = Object.defineProperty;
var s = (G, Q) => {
    for (var X in Q)
        i(G, X, {
            get: Q[X],
            enumerable: !0,
            configurable: !0,
            set: (Y) => (Q[X] = () => Y),
        });
};
var r = {};
s(r, {
    slotTypes: () => q,
    permissions: () => o,
    itemsHandlingFlags: () => O,
    itemClassifications: () => K,
    clientStatuses: () => P,
});
var P = { disconnected: 0, connected: 5, ready: 10, playing: 20, goal: 30 },
    K = { progression: 1, useful: 2, trap: 4, none: 0 },
    O = { minimal: 0, others: 1, own: 2, starting: 4, all: 7 },
    o = { disabled: 0, enabled: 1, goal: 2, auto: 6, autoEnabled: 7 },
    q = { spectator: 0, player: 1, group: 2 };
class U extends Error {}
class T extends Error {
    argumentName;
    value;
    constructor(G, Q, X) {
        super(G);
        (this.argumentName = Q), (this.value = structuredClone(X));
    }
}
class C extends Error {
    errors = [];
    constructor(G, Q) {
        super(G);
        this.errors = Q;
    }
}
class R extends Error {}
var H = {
    timeout: 1e4,
    autoFetchDataPackage: !0,
    maximumMessages: 1000,
    debugLogVersions: !0,
};
var l = { major: 0, minor: 5, build: 1 },
    c = "2.0.4";
function W() {
    let G = [];
    for (let Q = 0; Q < 36; Q++) G.push(Math.floor(Math.random() * 16));
    return (
        (G[14] = 4),
        (G[19] = G[19] &= -5),
        (G[19] = G[19] |= 8),
        (G[8] = G[13] = G[18] = G[23] = "-"),
        G.map((Q) => Q.toString(16)).join("")
    );
}
var B = {
    password: "",
    uuid: W(),
    tags: [],
    version: l,
    items: O.all,
    slotData: !0,
};
class z {
    #G;
    #Q;
    #X;
    #Y;
    constructor(G, Q, X, Y) {
        (this.#G = G), (this.#Q = Q), (this.#X = X), (this.#Y = Y);
    }
    toString() {
        return this.name;
    }
    get receiver() {
        return this.#Y;
    }
    get sender() {
        return this.#X;
    }
    get name() {
        return this.#G.package.lookupItemName(this.game, this.#Q.item, !0);
    }
    get id() {
        return this.#Q.item;
    }
    get locationName() {
        return this.#G.package.lookupLocationName(
            this.sender.game,
            this.#Q.location,
            !0
        );
    }
    get locationId() {
        return this.#Q.location;
    }
    get locationGame() {
        return this.sender.game;
    }
    get game() {
        return this.receiver.game;
    }
    get progression() {
        return (this.flags & K.progression) === K.progression;
    }
    get useful() {
        return (this.flags & K.useful) === K.useful;
    }
    get trap() {
        return (this.flags & K.trap) === K.trap;
    }
    get filler() {
        return this.flags === K.none;
    }
    get flags() {
        return this.#Q.flags;
    }
}
class N {
    game;
    checksum;
    itemTable;
    locationTable;
    reverseItemTable;
    reverseLocationTable;
    constructor(G, Q) {
        (this.game = G),
            (this.checksum = Q.checksum),
            (this.itemTable = Object.freeze(Q.item_name_to_id)),
            (this.locationTable = Object.freeze(Q.location_name_to_id)),
            (this.reverseItemTable = Object.freeze(
                Object.fromEntries(
                    Object.entries(this.itemTable).map(([X, Y]) => [Y, X])
                )
            )),
            (this.reverseLocationTable = Object.freeze(
                Object.fromEntries(
                    Object.entries(this.locationTable).map(([X, Y]) => [Y, X])
                )
            ));
    }
    exportPackage() {
        return {
            checksum: this.checksum,
            item_name_to_id: { ...this.itemTable },
            location_name_to_id: { ...this.locationTable },
        };
    }
}
class S {
    #G;
    #Q = new Map();
    #X = new Map();
    #Y = new Set();
    constructor(G) {
        (this.#G = G),
            this.#G.socket.on("roomInfo", (Q) => {
                this.#Q.clear(),
                    this.#X.clear(),
                    this.#Y.clear(),
                    this.#Q.set("Archipelago", this.#Z());
                for (let X in Q.datapackage_checksums)
                    this.#X.set(X, Q.datapackage_checksums[X]), this.#Y.add(X);
            });
    }
    findPackage(G) {
        return this.#Q.get(G) ?? null;
    }
    async fetchPackage(G = [], Q = !0) {
        if (G.length === 0) G = Array.from(this.#Y);
        G = G.filter((Y) => {
            if (!this.#Y.has(Y)) return !1;
            if (this.#Q.get(Y)?.checksum !== this.#X.get(Y)) return !0;
            return !1;
        });
        let X = { games: {} };
        for (let Y of G) {
            let Z = { cmd: "GetDataPackage", games: [Y] },
                [$] = await this.#G.socket.send(Z).wait("dataPackage");
            X.games[Y] = $.data.games[Y];
        }
        if (Q) this.importPackage(X);
        return X;
    }
    importPackage(G) {
        for (let Q in G.games)
            this.#Q.set(Q, new N(Q, G.games[Q])),
                this.#X.set(Q, G.games[Q].checksum);
    }
    exportPackage() {
        let G = {};
        for (let [Q, X] of this.#Q.entries()) G[Q] = X.exportPackage();
        return { games: G };
    }
    lookupItemName(G, Q, X = !0) {
        let Y = `Unknown Item ${Q}`,
            Z = this.findPackage(G);
        if (!Z) return X ? Y : void 0;
        let $ = Z.reverseItemTable[Q];
        if (X && $ === void 0) return Y;
        return $;
    }
    lookupLocationName(G, Q, X = !0) {
        let Y = `Unknown Location ${Q}`,
            Z = this.findPackage(G);
        if (!Z) return X ? Y : void 0;
        let $ = Z.reverseLocationTable[Q];
        if (X && $ === void 0) return Y;
        return $;
    }
    #Z() {
        return new N("Archipelago", {
            checksum: "ac9141e9ad0318df2fa27da5f20c50a842afeecb",
            item_name_to_id: { Nothing: -1 },
            location_name_to_id: { "Cheat Console": -1, Server: -2 },
        });
    }
}
class A {
    #G;
    #Q = [];
    #X;
    #Y;
    constructor(G, Q, X) {
        (this.#G = G), (this.#X = Q), (this.#Y = X);
    }
    replace(G) {
        return this.#Q.push({ operation: "replace", value: G }), this;
    }
    default() {
        return this.#Q.push({ operation: "default", value: null }), this;
    }
    add(G) {
        return this.#Q.push({ operation: "add", value: G }), this;
    }
    multiply(G) {
        return this.#Q.push({ operation: "mul", value: G }), this;
    }
    power(G) {
        return this.#Q.push({ operation: "pow", value: G }), this;
    }
    remainder(G) {
        return this.#Q.push({ operation: "mod", value: G }), this;
    }
    floor() {
        return this.#Q.push({ operation: "floor", value: null }), this;
    }
    ceiling() {
        return this.#Q.push({ operation: "ceil", value: null }), this;
    }
    max(G) {
        return this.#Q.push({ operation: "max", value: G }), this;
    }
    min(G) {
        return this.#Q.push({ operation: "min", value: G }), this;
    }
    and(G) {
        return this.#Q.push({ operation: "and", value: G }), this;
    }
    or(G) {
        return this.#Q.push({ operation: "or", value: G }), this;
    }
    xor(G) {
        return this.#Q.push({ operation: "xor", value: G }), this;
    }
    leftShift(G) {
        return this.#Q.push({ operation: "left_shift", value: G }), this;
    }
    rightShift(G) {
        return this.#Q.push({ operation: "right_shift", value: G }), this;
    }
    remove(G) {
        return this.#Q.push({ operation: "remove", value: G }), this;
    }
    pop(G) {
        return this.#Q.push({ operation: "pop", value: G }), this;
    }
    update(G) {
        return this.#Q.push({ operation: "update", value: G }), this;
    }
    async commit(G = !1) {
        let Q = W(),
            X = {
                cmd: "Set",
                default: this.#Y,
                key: this.#X,
                operations: this.#Q,
                want_reply: G,
                uuid: Q,
            };
        if ((this.#G.socket.send(X), !G)) return;
        let [Y] = await this.#G.socket.wait("setReply", (Z) => Z.uuid === Q);
        return Y.value;
    }
}
class I {
    #G;
    #Q = {};
    #X = {};
    constructor(G) {
        (this.#G = G),
            this.#G.socket
                .on("disconnected", () => {
                    (this.#Q = {}), (this.#X = {});
                })
                .on("setReply", (Q) => {
                    this.#Q[Q.key] = Q.value;
                    let X = this.#X[Q.key];
                    if (X)
                        X.forEach((Y) => Y(Q.key, Q.value, Q.original_value));
                })
                .on("connected", () => {
                    if (this.#G.options.debugLogVersions) {
                        let Q = `${this.#G.game}:${c}:${navigator?.userAgent}`;
                        this.prepare("archipelago.js__runtimes", {})
                            .default()
                            .update({ [Q]: !0 })
                            .commit(!1);
                    }
                });
    }
    get store() {
        return structuredClone(this.#Q);
    }
    async fetch(G, Q = !1) {
        let X = typeof G === "string" ? [G] : G;
        if (Q) {
            let Z = X.filter(($) => this.#Q[$] === void 0);
            if (Z.length > 0)
                this.#G.socket.send({ cmd: "SetNotify", keys: Z });
        }
        let Y = {};
        if (
            ((X = X.filter((Z) => {
                let $ = structuredClone(this.#Q[Z]),
                    j = $ !== void 0;
                if (j) Y[Z] = $;
                return !j;
            })),
            X.length > 0)
        ) {
            let Z = await this.#Y(X);
            Y = { ...Y, ...Z };
        }
        if (Q) this.#Q = { ...this.#Q, ...Y };
        return typeof G === "string" ? Y[G] : Y;
    }
    async notify(G, Q) {
        return (
            G.forEach((X) => {
                (this.#X[X] ??= []), this.#X[X].push(Q);
            }),
            this.fetch(G, !0)
        );
    }
    prepare(G, Q) {
        if (G.startsWith("_read_"))
            throw TypeError("Cannot manipulate read only keys.");
        return new A(this.#G, G, Q);
    }
    async fetchItemNameGroups(G) {
        return await this.fetch([`_read_item_name_groups_${G}`], !0);
    }
    async fetchLocationNameGroups(G) {
        return await this.fetch([`_read_location_name_groups_${G}`], !0);
    }
    async #Y(G) {
        let Q = W(),
            [X] = await this.#G.socket
                .send({ cmd: "Get", keys: G, uuid: Q })
                .wait("retrieved", (Y) => Y.uuid === Q);
        return X.keys;
    }
}
class E {
    #G = {};
    addEventListener(G, Q, X = !1) {
        (this.#G[G] ??= []), this.#G[G].push([Q, X]);
    }
    removeEventListener(G, Q) {
        let X = this.#G[G];
        if (X && X.length > 0) this.#G[G] = X.filter(([Y]) => Y !== Q);
    }
    dispatchEvent(G, Q) {
        let X = this.#G[G] ?? [];
        for (let [Y, Z] of X) if ((Y(...Q), Z)) this.removeEventListener(G, Y);
    }
}
class J {
    #G = new E();
    on(G, Q) {
        return this.#G.addEventListener(G, Q), this;
    }
    off(G, Q) {
        return this.#G.removeEventListener(G, Q), this;
    }
    async wait(G, Q = () => !0) {
        return new Promise((X) => {
            let Y = (...Z) => {
                if (Q(...Z)) this.#G.removeEventListener(G, Y), X(Z);
            };
            this.#G.addEventListener(G, Y);
        });
    }
    emit(G, Q) {
        this.#G.dispatchEvent(G, Q);
    }
}
class M extends J {
    #G;
    #Q = Number.MIN_SAFE_INTEGER;
    constructor(G) {
        super();
        (this.#G = G),
            this.#G.socket.on("bounced", (Q) => {
                if (
                    Q.tags?.includes("DeathLink") &&
                    Q.data.time &&
                    Q.data.source
                ) {
                    let X = Q.data;
                    if (X.time === this.#Q) return;
                    (this.#Q = X.time),
                        this.emit("deathReceived", [
                            X.source,
                            X.time * 1000,
                            X.cause,
                        ]);
                }
            });
    }
    get enabled() {
        return this.#G.arguments.tags.includes("DeathLink");
    }
    enableDeathLink() {
        if (this.#G.arguments.tags.includes("DeathLink")) return;
        this.#G.updateTags([...this.#G.arguments.tags, "DeathLink"]);
    }
    disableDeathLink() {
        if (!this.#G.arguments.tags.includes("DeathLink")) return;
        this.#G.updateTags(
            this.#G.arguments.tags.filter((G) => G !== "DeathLink")
        );
    }
    sendDeathLink(G, Q) {
        if (!this.#G.authenticated)
            throw new R(
                "Cannot send death links before connecting and authenticating."
            );
        if (!this.enabled) return;
        this.#Q = Math.ceil(Date.now() / 1000);
        let X = { source: G, cause: Q, time: this.#Q };
        this.#G.bounce({ tags: ["DeathLink"] }, X);
    }
}
class F {
    #G;
    #Q;
    #X;
    constructor(G, Q) {
        (this.#G = G),
            (this.#Q = Q),
            (this.#X = new z(
                this.#G,
                {
                    item: Q.item,
                    location: Q.location,
                    player: Q.finding_player,
                    flags: Q.item_flags,
                },
                this.#G.players.findPlayer(Q.finding_player),
                this.#G.players.findPlayer(Q.receiving_player)
            ));
    }
    get item() {
        return this.#X;
    }
    get found() {
        return this.#Q.found;
    }
    get entrance() {
        return this.#Q.entrance || "Vanilla";
    }
    get uniqueKey() {
        return `${this.#X.sender.slot}-${this.#X.locationId}`;
    }
    static getUniqueKey(G) {
        return `${G.finding_player}-${G.location}`;
    }
}
class f extends J {
    #G;
    #Q = [];
    #X = [];
    #Y = new Map();
    constructor(G) {
        super();
        (this.#G = G),
            this.#G.socket
                .on("receivedItems", (Q) => {
                    let X = Q.index,
                        Y = Q.items.length,
                        Z = [...Q.items];
                    while (Z.length > 0) {
                        let $ = Z.shift();
                        this.#Q[X++] = new z(
                            this.#G,
                            $,
                            this.#G.players.findPlayer($.player),
                            this.#G.players.self
                        );
                    }
                    this.emit("itemsReceived", [
                        this.#Q.slice(Q.index, Q.index + Y),
                        Q.index,
                    ]);
                })
                .on("connected", () => {
                    (this.#X = []),
                        (this.#Y = new Map()),
                        (this.#Q = []),
                        this.#G.storage
                            .notify(
                                [
                                    `_read_hints_${this.#G.players.self.team}_${this.#G.players.self.slot}`,
                                ],
                                this.#Z.bind(this)
                            )
                            .then((Q) => {
                                let X =
                                    Q[
                                        `_read_hints_${this.#G.players.self.team}_${this.#G.players.self.slot}`
                                    ];
                                (this.#X = X.map((Y, Z) => {
                                    let $ = new F(this.#G, Y);
                                    return this.#Y.set($.uniqueKey, Z), $;
                                })),
                                    this.emit("hintsInitialized", [
                                        [...this.#X],
                                    ]);
                            })
                            .catch((Q) => {
                                throw Q;
                            });
                });
    }
    get received() {
        return [...this.#Q];
    }
    get hints() {
        return [...this.#X];
    }
    get count() {
        return this.#Q.length;
    }
    #Z(G, Q) {
        for (let X = 0; X < Q.length; X++) {
            let Y = F.getUniqueKey(Q[X]),
                Z = this.#Y.get(Y);
            if (Z !== void 0 && this.#X[Z].found !== Q[X].found) {
                let $ = new F(this.#G, Q[X]);
                (this.#X[Z] = $), this.emit("hintFound", [$]);
            } else if (Z === void 0) {
                let $ = new F(this.#G, Q[X]);
                this.#Y.set($.uniqueKey, this.#X.length),
                    this.#X.push($),
                    this.emit("hintReceived", [$]);
            }
        }
    }
}
class x {
    client;
    part;
    constructor(G, Q) {
        (this.client = G), (this.part = Q);
    }
    toString() {
        return this.text;
    }
}
class w extends x {
    part;
    type = "item";
    item;
    constructor(G, Q, X, Y) {
        super(G, Q);
        let Z = G.players.findPlayer(Q.player, Y.team);
        (this.part = Q), (this.item = new z(G, X, Z, Y));
    }
    get text() {
        return this.item.name;
    }
}
class b extends x {
    #G;
    part;
    type = "location";
    id;
    constructor(G, Q) {
        super(G, Q);
        let X = G.players.findPlayer(Q.player),
            Y = G.package.findPackage(X.game);
        if (((this.part = Q), Q.type === "location_name"))
            (this.#G = Q.text), (this.id = Y.locationTable[Q.text]);
        else
            (this.id = parseInt(Q.text)),
                (this.#G = G.package.lookupLocationName(X.game, this.id, !0));
    }
    get text() {
        return this.#G;
    }
}
class v extends x {
    part;
    type = "color";
    color;
    constructor(G, Q) {
        super(G, Q);
        (this.part = Q), (this.color = Q.color);
    }
    get text() {
        return this.part.text;
    }
}
class y extends x {
    part;
    type;
    constructor(G, Q) {
        super(G, Q);
        if (((this.part = Q), this.part.type === "entrance_name"))
            this.type = "entrance";
        else this.type = "text";
    }
    get text() {
        return this.part.text;
    }
}
class m extends x {
    part;
    type = "player";
    player;
    constructor(G, Q) {
        super(G, Q);
        if (((this.part = Q), Q.type === "player_id"))
            this.player = G.players.findPlayer(parseInt(Q.text));
        else {
            let X = G.players.teams[G.players.self.team].find(
                (Y) => Y.name === Q.text
            );
            if (!X) throw Error(`Cannot find player under name: ${Q.text}`);
            this.player = X;
        }
    }
    get text() {
        return this.player.alias;
    }
}
class u extends J {
    #G;
    #Q = [];
    get log() {
        return [...this.#Q];
    }
    constructor(G) {
        super();
        (this.#G = G), this.#G.socket.on("printJSON", this.#X.bind(this));
    }
    async say(G) {
        if (!this.#G.authenticated)
            throw new R(
                "Cannot send chat messages without being authenticated."
            );
        G = G.trim();
        let Q = { cmd: "Say", text: G };
        this.#G.socket.send(Q), await this.wait("chat", (X) => X === G);
    }
    #X(G) {
        let Q = [];
        for (let Y of G.data)
            switch (Y.type) {
                case "item_id":
                case "item_name": {
                    let Z = G,
                        $;
                    if (Z.type === "ItemCheat")
                        $ = this.#G.players.findPlayer(Z.receiving, Z.team);
                    else $ = this.#G.players.findPlayer(Z.receiving);
                    Q.push(new w(this.#G, Y, Z.item, $));
                    break;
                }
                case "location_id":
                case "location_name": {
                    Q.push(new b(this.#G, Y));
                    break;
                }
                case "color": {
                    Q.push(new v(this.#G, Y));
                    break;
                }
                case "player_id":
                case "player_name": {
                    Q.push(new m(this.#G, Y));
                    break;
                }
                default: {
                    Q.push(new y(this.#G, Y));
                    break;
                }
            }
        let X = Q.map((Y) => Y.text).join();
        if (this.#G.options.maximumMessages >= 1)
            this.log.push({ text: X, nodes: Q }),
                this.log.splice(
                    0,
                    this.log.length - this.#G.options.maximumMessages
                );
        switch (G.type) {
            case "ItemSend": {
                let Y = this.#G.players.findPlayer(G.item.player),
                    Z = this.#G.players.findPlayer(G.receiving),
                    $ = new z(this.#G, G.item, Y, Z);
                this.emit("itemSent", [X, $, Q]);
                break;
            }
            case "ItemCheat": {
                let Y = this.#G.players.findPlayer(G.item.player, G.team),
                    Z = this.#G.players.findPlayer(G.receiving, G.team),
                    $ = new z(this.#G, G.item, Y, Z);
                this.emit("itemCheated", [X, $, Q]);
                break;
            }
            case "Hint": {
                let Y = this.#G.players.findPlayer(G.item.player),
                    Z = this.#G.players.findPlayer(G.receiving),
                    $ = new z(this.#G, G.item, Y, Z);
                this.emit("itemHinted", [X, $, G.found, Q]);
                break;
            }
            case "Join": {
                let Y = this.#G.players.findPlayer(G.slot, G.team);
                this.emit("connected", [X, Y, G.tags, Q]);
                break;
            }
            case "Part": {
                let Y = this.#G.players.findPlayer(G.slot, G.team);
                this.emit("disconnected", [X, Y, Q]);
                break;
            }
            case "Chat": {
                let Y = this.#G.players.findPlayer(G.slot, G.team);
                this.emit("chat", [G.message, Y, Q]);
                break;
            }
            case "ServerChat": {
                this.emit("serverChat", [G.message, Q]);
                break;
            }
            case "TagsChanged": {
                let Y = this.#G.players.findPlayer(G.slot, G.team);
                this.emit("tagsUpdated", [X, Y, G.tags, Q]);
                break;
            }
            case "Tutorial": {
                this.emit("tutorial", [X, Q]);
                break;
            }
            case "CommandResult": {
                this.emit("userCommand", [X, Q]);
                break;
            }
            case "AdminCommandResult": {
                this.emit("adminCommand", [X, Q]);
                break;
            }
            case "Goal": {
                let Y = this.#G.players.findPlayer(G.slot, G.team);
                this.emit("goaled", [X, Y, Q]);
                break;
            }
            case "Release": {
                let Y = this.#G.players.findPlayer(G.slot, G.team);
                this.emit("released", [X, Y, Q]);
                break;
            }
            case "Collect": {
                let Y = this.#G.players.findPlayer(G.slot, G.team);
                this.emit("collected", [X, Y, Q]);
                break;
            }
            case "Countdown":
                this.emit("countdown", [X, G.countdown, Q]);
        }
        this.emit("message", [X, Q]);
    }
}
class _ {
    #G;
    #Q;
    constructor(G, Q) {
        (this.#G = G), (this.#Q = Q);
    }
    toString() {
        return this.alias;
    }
    get name() {
        return this.#Q.name;
    }
    get alias() {
        return this.#Q.alias;
    }
    get game() {
        if (this.slot === 0) return "Archipelago";
        return this.#X.game;
    }
    get type() {
        if (this.slot === 0) return q.spectator;
        return this.#X.type;
    }
    get team() {
        return this.#Q.team;
    }
    get slot() {
        return this.#Q.slot;
    }
    get members() {
        if (this.type !== q.group) return [];
        return this.#G.players.teams[this.team].filter((G) =>
            this.#X.group_members.includes(G.slot)
        );
    }
    get groups() {
        if (this.slot === 0) return [];
        return this.#G.players.teams[this.team].filter(
            (G) =>
                G.slot !== 0 &&
                this.#G.players.slots[G.slot].group_members.includes(this.slot)
        );
    }
    async fetchStatus() {
        if (this.type === q.group) return P.goal;
        return (
            (await this.#G.storage.fetch(
                `_read_client_status_${this.team}_${this.slot}`
            )) ?? 0
        );
    }
    async fetchSlotData() {
        return await this.#G.storage.fetch(`_read_slot_data_${this.slot}`);
    }
    async fetchHints() {
        return (
            await this.#G.storage.fetch(`_read_hints_${this.team}_${this.slot}`)
        ).map((Q) => new F(this.#G, Q));
    }
    get #X() {
        return this.#G.players.slots[this.slot];
    }
}
class g extends J {
    #G;
    #Q = [];
    #X = {};
    #Y = 0;
    #Z = 0;
    constructor(G) {
        super();
        (this.#G = G),
            this.#G.socket
                .on("connected", (Q) => {
                    (this.#X = Object.freeze(Q.slot_info)),
                        (this.#Q = []),
                        (this.#Y = Q.slot),
                        (this.#Z = Q.team);
                    for (let X of Q.players)
                        (this.#Q[X.team] ??= [
                            {
                                team: X.team,
                                slot: 0,
                                name: "Archipelago",
                                alias: "Archipelago",
                            },
                        ]),
                            (this.#Q[X.team][X.slot] = X);
                })
                .on("roomUpdate", (Q) => {
                    if (!Q.players) return;
                    for (let X of Q.players)
                        if (this.#Q[X.team][X.slot].alias !== X.alias) {
                            let Y = this.#Q[X.team][X.slot].alias;
                            (this.#Q[X.team][X.slot] = X),
                                this.emit("aliasUpdated", [
                                    new _(this.#G, X),
                                    Y,
                                    X.alias,
                                ]);
                        }
                });
    }
    get self() {
        if (this.#Y === 0)
            throw Error(
                "Cannot lookup own player object when client has never connected to a server."
            );
        return new _(this.#G, this.#Q[this.#Z][this.#Y]);
    }
    get slots() {
        return this.#X;
    }
    get teams() {
        let G = [];
        for (let Q = 0; Q < this.#Q.length; Q++) {
            G[Q] = [];
            for (let X = 0; X < this.#Q[Q].length; X++)
                G[Q].push(new _(this.#G, this.#Q[Q][X]));
        }
        return G;
    }
    findPlayer(G, Q) {
        if (Q === void 0) Q = this.#G.players.self.team;
        if (this.#Q[Q]) return new _(this.#G, this.#Q[Q][G]);
        return;
    }
}
class h extends J {
    #G;
    #Q = { major: -1, minor: -1, build: -1 };
    #X = { major: -1, minor: -1, build: -1 };
    #Y = [];
    #Z = [];
    #F = "";
    #U = !1;
    #z = 0;
    #V = 0;
    #J = 0;
    #R = { release: 0, collect: 0, remaining: 0 };
    #K = [];
    #$ = [];
    #P = !1;
    get serverVersion() {
        return { ...this.#Q };
    }
    get generatorVersion() {
        return { ...this.#X };
    }
    get games() {
        return [...this.#Y];
    }
    get tags() {
        return [...this.#Z];
    }
    get seedName() {
        return this.#F;
    }
    get password() {
        return this.#U;
    }
    get permissions() {
        return { ...this.#R };
    }
    get hintPoints() {
        return this.#z;
    }
    get hintCost() {
        if (this.hintCostPercentage > 0)
            return Math.max(
                1,
                Math.floor(
                    this.hintCostPercentage * this.allLocations.length * 0.01
                )
            );
        return 0;
    }
    get hintCostPercentage() {
        return this.#V;
    }
    get locationCheckPoints() {
        return this.#J;
    }
    get missingLocations() {
        return [...this.#K].sort();
    }
    get checkedLocations() {
        return [...this.#$].sort();
    }
    get allLocations() {
        return [...this.#K, ...this.#$].sort();
    }
    get race() {
        return this.#P;
    }
    constructor(G) {
        super();
        (this.#G = G),
            this.#G.socket
                .on("roomInfo", (Q) => {
                    (this.#Q = {
                        major: Q.version.major,
                        minor: Q.version.minor,
                        build: Q.version.build,
                    }),
                        (this.#X = {
                            major: Q.generator_version.major,
                            minor: Q.generator_version.minor,
                            build: Q.generator_version.build,
                        }),
                        (this.#Z = Q.tags),
                        (this.#Y = Q.games),
                        (this.#F = Q.seed_name),
                        (this.#U = Q.password),
                        (this.#R = Q.permissions),
                        (this.#V = Q.hint_cost),
                        (this.#J = Q.location_check_points);
                })
                .on("connected", (Q) => {
                    (this.#K = Q.missing_locations),
                        (this.#$ = Q.checked_locations),
                        this.emit("locationsChecked", [this.checkedLocations]),
                        (this.#z = Q.hint_points),
                        this.emit("hintPointsUpdated", [0, Q.hint_points]);
                })
                .on("roomUpdate", (Q) => {
                    if (Q.hint_cost !== void 0) {
                        let [X, Y] = [this.hintCost, this.hintCostPercentage];
                        (this.#V = Q.hint_cost),
                            this.emit("hintCostUpdated", [
                                X,
                                this.hintCost,
                                Y,
                                this.hintCostPercentage,
                            ]);
                    }
                    if (Q.hint_points !== void 0) {
                        let X = this.#z;
                        (this.#z = Q.hint_points),
                            this.emit("hintPointsUpdated", [
                                X,
                                this.hintPoints,
                            ]);
                    }
                    if (Q.location_check_points !== void 0) {
                        let X = this.#J;
                        (this.#J = Q.location_check_points),
                            this.emit("locationCheckPointsUpdated", [
                                X,
                                this.locationCheckPoints,
                            ]);
                    }
                    if (Q.password !== void 0)
                        (this.#U = Q.password),
                            this.emit("passwordUpdated", [this.password]);
                    if (Q.permissions !== void 0) {
                        let X = this.#R;
                        (this.#R = Q.permissions),
                            this.emit("permissionsUpdated", [
                                X,
                                this.permissions,
                            ]);
                    }
                    if (Q.checked_locations !== void 0)
                        (this.#$ = [...this.#$, ...Q.checked_locations]),
                            (this.#K = this.missingLocations.filter(
                                (X) => !Q.checked_locations?.includes(X)
                            )),
                            this.emit("locationsChecked", [
                                Q.checked_locations,
                            ]);
                });
    }
}
class d extends J {
    #G = null;
    #Q = !1;
    constructor() {
        super();
    }
    get connected() {
        return this.#Q;
    }
    get url() {
        return this.#G?.url ?? "";
    }
    send(...G) {
        if (this.#G)
            return (
                this.#G.send(JSON.stringify(G)),
                this.emit("sentPackets", [G]),
                this
            );
        throw new U(
            "Unable to send packets to the server; not connected to a server."
        );
    }
    async connect(G) {
        if ((this.disconnect(), typeof G === "string")) {
            if (!/^([a-zA-Z]+:)\/\/[A-Za-z0-9_.~\-:]+/i.test(G))
                try {
                    return await this.connect(new URL(`wss://${G}`));
                } catch {
                    return await this.connect(new URL(`ws://${G}`));
                }
            G = new URL(G);
        }
        if (
            ((G.port = G.port || "38281"),
            G.protocol !== "wss:" && G.protocol !== "ws:")
        )
            throw TypeError(
                "Unexpected protocol. Archipelago only supports the ws:// and wss:// protocols."
            );
        try {
            return new Promise((Q, X) => {
                let Y = this.#Y();
                if (Y === null)
                    throw new U(
                        "Unable to find a suitable WebSocket API in the current runtime."
                    );
                (this.#G = new Y(G)),
                    (this.#G.onmessage = this.#X.bind(this)),
                    (this.#G.onclose = () => {
                        this.disconnect(),
                            X(
                                new U(
                                    "Failed to connect to Archipelago server."
                                )
                            );
                    }),
                    (this.#G.onerror = () => {
                        this.disconnect(),
                            X(
                                new U(
                                    "Failed to connect to Archipelago server."
                                )
                            );
                    }),
                    (this.#G.onopen = () => {
                        this.wait("roomInfo")
                            .then(([Z]) => {
                                if (((this.#Q = !0), this.#G)) {
                                    (this.#G.onclose =
                                        this.disconnect.bind(this)),
                                        (this.#G.onerror =
                                            this.disconnect.bind(this)),
                                        Q(Z);
                                    return;
                                }
                                this.disconnect(),
                                    X(
                                        new U(
                                            "Failed to connect to Archipelago server."
                                        )
                                    );
                            })
                            .catch((Z) => {
                                throw Z;
                            });
                    });
            });
        } catch (Q) {
            throw (this.disconnect(), Q);
        }
    }
    disconnect() {
        if (!this.connected) return;
        (this.#Q = !1),
            this.#G?.close(),
            (this.#G = null),
            this.emit("disconnected", []);
    }
    #X(G) {
        let Q = JSON.parse(G.data);
        for (let X of Q) {
            switch (X.cmd) {
                case "ConnectionRefused":
                    this.emit("connectionRefused", [X]);
                    break;
                case "Bounced":
                    this.emit("bounced", [X, X.data]);
                    break;
                case "Connected":
                    this.emit("connected", [X]);
                    break;
                case "DataPackage":
                    this.emit("dataPackage", [X]);
                    break;
                case "InvalidPacket":
                    this.emit("invalidPacket", [X]);
                    break;
                case "LocationInfo":
                    this.emit("locationInfo", [X]);
                    break;
                case "PrintJSON":
                    this.emit("printJSON", [X]);
                    break;
                case "ReceivedItems":
                    this.emit("receivedItems", [X]);
                    break;
                case "Retrieved":
                    this.emit("retrieved", [X]);
                    break;
                case "RoomInfo":
                    this.emit("roomInfo", [X]);
                    break;
                case "RoomUpdate":
                    this.emit("roomUpdate", [X]);
                    break;
                case "SetReply":
                    this.emit("setReply", [X]);
                    break;
            }
            this.emit("receivedPacket", [X]);
        }
    }
    #Y() {
        let G = null;
        if (typeof window < "u") G = window.WebSocket || window.MozWebSocket;
        else if (typeof global < "u")
            G = global.WebSocket || global.MozWebSocket;
        else if (typeof self < "u") G = self.WebSocket || self.MozWebSocket;
        else if (typeof WebSocket < "u") G = WebSocket;
        else if (typeof MozWebSocket < "u") G = MozWebSocket;
        return G;
    }
}
class n {
    #G = !1;
    #Q = B;
    #X = "";
    #Y = "";
    socket = new d();
    package = new S(this);
    storage = new I(this);
    room = new h(this);
    players = new g(this);
    items = new f(this);
    messages = new u(this);
    deathLink = new M(this);
    options;
    get authenticated() {
        return this.socket.connected && this.#G;
    }
    get name() {
        return this.#X;
    }
    get game() {
        return this.#Y;
    }
    get arguments() {
        return { ...this.#Q };
    }
    constructor(G) {
        if (G) this.options = { ...H, ...G };
        else this.options = { ...H };
        this.socket
            .on("disconnected", () => {
                this.#G = !1;
            })
            .on("sentPackets", (Q) => {
                for (let X of Q)
                    if (X.cmd === "ConnectUpdate")
                        (this.#Q.tags = X.tags),
                            (this.#Q.items = X.items_handling);
            });
    }
    async login(G, Q, X = "", Y) {
        if (Q === "")
            throw new T("Provided slot name cannot be blank.", "name", Q);
        if (Y) this.#Q = { ...B, ...Y };
        else this.#Q = { ...B };
        let Z = new Set(this.arguments.tags);
        if (!X && !Z.has("HintGame") && !Z.has("Tracker") && !Z.has("TextOnly"))
            Z.add("TextOnly");
        this.#Q.tags = Array.from(Z);
        let $ = {
            cmd: "Connect",
            name: Q,
            game: X,
            password: this.arguments.password,
            slot_data: this.arguments.slotData,
            items_handling: this.arguments.items,
            uuid: this.arguments.uuid,
            tags: this.arguments.tags,
            version: { ...this.arguments.version, class: "Version" },
        };
        if ((await this.socket.connect(G), this.options.autoFetchDataPackage))
            await this.package.fetchPackage();
        return new Promise((j, k) => {
            let p = setTimeout(
                    () => k(new U("Server failed to respond in time.")),
                    this.options.timeout
                ),
                D = (V) => {
                    (this.#G = !0),
                        (this.#Y = V.slot_info[V.slot].game),
                        (this.#X = V.slot_info[V.slot].name),
                        this.socket
                            .off("connected", D)
                            .off("connectionRefused", L),
                        clearTimeout(p),
                        j(V.slot_data);
                },
                L = (V) => {
                    this.socket.off("connected", D).off("connectionRefused", L),
                        clearTimeout(p),
                        k(
                            new C(
                                `Connection was refused by the server. Reason(s): [${V.errors?.join(", ")}`,
                                V.errors ?? []
                            )
                        );
                };
            this.socket
                .on("connected", D.bind(this))
                .on("connectionRefused", L.bind(this))
                .send($);
        });
    }
    updateStatus(G) {
        if (!this.authenticated)
            throw new R(
                "Cannot update status while not connected and authenticated."
            );
        this.socket.send({ cmd: "StatusUpdate", status: G });
    }
    goal() {
        this.updateStatus(P.goal);
    }
    updateTags(G) {
        if (!this.authenticated)
            throw new R(
                "Cannot update tags while not connected and authenticated."
            );
        this.socket.send({
            cmd: "ConnectUpdate",
            tags: G,
            items_handling: this.arguments.items,
        });
    }
    updateItemsHandling(G) {
        if (!this.authenticated)
            throw new R(
                "Cannot update tags while not connected and authenticated."
            );
        this.socket.send({
            cmd: "ConnectUpdate",
            tags: this.arguments.tags,
            items_handling: G,
        });
    }
    check(...G) {
        if (!this.authenticated)
            throw new R(
                "Cannot check locations while not connected and authenticated."
            );
        (G = G.filter((Q) => this.room.missingLocations.includes(Q))),
            this.socket.send({ cmd: "LocationChecks", locations: G });
    }
    async scout(G, Q = 0) {
        if (!this.authenticated)
            throw new R(
                "Cannot scout locations while not connected and authenticated."
            );
        G = G.filter((Y) => this.room.allLocations.includes(Y));
        let [X] = await this.socket
            .send({ cmd: "LocationScouts", create_as_hint: Q, locations: G })
            .wait("locationInfo", (Y) => {
                return (
                    Y.locations
                        .map((Z) => Z.location)
                        .toSorted()
                        .join(",") === G.toSorted().join(",")
                );
            });
        return X.locations.map(
            (Y) =>
                new z(
                    this,
                    Y,
                    this.players.self,
                    this.players.findPlayer(Y.player)
                )
        );
    }
    bounce(G, Q) {
        if (!this.authenticated)
            throw new R(
                "Cannot send bounces while not connected and authenticated."
            );
        this.socket.send({
            cmd: "Bounce",
            data: Q,
            games: G.games ?? [],
            slots: G.slots ?? [],
            tags: G.tags ?? [],
        });
    }
}
export {
    l as targetVersion,
    q as slotTypes,
    o as permissions,
    c as libraryVersion,
    O as itemsHandlingFlags,
    K as itemClassifications,
    B as defaultConnectionOptions,
    H as defaultClientOptions,
    P as clientStatuses,
    R as UnauthenticatedError,
    y as TextualMessageNode,
    d as SocketManager,
    U as SocketError,
    h as RoomStateManager,
    g as PlayersManager,
    m as PlayerMessageNode,
    _ as Player,
    N as PackageMetadata,
    u as MessageManager,
    C as LoginError,
    b as LocationMessageNode,
    f as ItemsManager,
    w as ItemMessageNode,
    z as Item,
    A as IntermediateDataOperation,
    F as Hint,
    J as EventBasedManager,
    M as DeathLinkManager,
    I as DataStorageManager,
    S as DataPackageManager,
    v as ColorMessageNode,
    n as Client,
    x as BaseMessageNode,
    T as ArgumentError,
    r as API,
};

