function id(id) { return document.getElementById(id); }

function createClusterTag(a) {
    let arg = document.createElement("span");
    arg.classList.add("cluster", clusterTypes[a].styleTag);
    arg.innerText = clusterTypes[a].name;
    return arg;
}

function setClusterList(data, container) {
    console.log(data);
    if(data.length == 0) {
        container.innerText = "N/A";
        return;
    }
    for(let a of data) {
        if(typeof a == "object") {
            /** Multiple types possible. */
            container.innerHTML += "[";
            for(let b in a) {
                container.appendChild(createClusterTag(a[b]));
                if(b != a.length - 1) {
                    container.innerHTML += ",";
                }
            }
            container.innerHTML += "]";
        } else {
            container.appendChild(createClusterTag(a));
        }
    }
}

function updateIncantSelectorUI(incant) {
    let incData = incantTypes[incant];
    if(incData != null) {
        id("editIncantSelectedTitle").innerText = incant.toUpperCase();

        id("newIncantArgumentList").innerHTML = "";
        setClusterList(incData.arguments, id("newIncantArgumentList"));

        id("newIncantReturnList").innerHTML = "";
        setClusterList(incData.returns, id("newIncantReturnList"));

        id("newIncantDescription").innerText = incData.description;
    }
}

id("newIncantSelector").addEventListener("change", function() {
    let v = this.value;
    updateIncantSelectorUI(v);
});

window.addEventListener("load", function() {
    for(let i of Object.keys(incantTypes)) {
        let opt = document.createElement("option");
        opt.value = i;
        opt.innerText = i.toUpperCase();
        id("newIncantSelector").appendChild(opt);
    }

    id("newIncantSubmit").addEventListener("click", function() {
        if(id("newIncantSelector").value != 0) {
            let incant = document.createElement("div");
            incant.classList.add("spellIncant");
            incant.innerText = id("newIncantSelector").value.toUpperCase();
            id("spellContainer").appendChild(incant);
        }
        id("newIncantSelector").value = "0";
    });
});

const clusterTypes = {
    entity: {
        "styleTag": "entity",
        "name": "Entity"
    },
    block: {
        "styleTag": "block",
        "name": "Block"
    },
    vector: {
        "styleTag": "vector",
        "name": "Vector"
    },
    item: {
        "styleTag": "item",
        "name": "Item"
    },
    rotation: {
        "styleTag": "rotation",
        "name": "Rotation"
    },
    word: {
        "styleTag": "word",
        "name": "Word"
    },
    boolean: {
        "styleTag": "boolean",
        "name": "Boolean"
    },
    scalar: {
        "styleTag": "scalar",
        "name": "Scalar"
    },
    list: {
        "styleTag": "list",
        "name": "List"
    },
    nil: {
        "styleTag": "null",
        "name": "Null"
    }
};

const incantTypes = {
    "ete": {
        arguments: [],
        returns: ["entity"],
        description: "Gets self.",
        tags: ["sensors"]
    },
    "esijit": {
        arguments: ["entity"],
        returns: [["entity", "nil"]],
        description: "Gets the entity an entity is looking at.",
        tags: ["sensors"]
    },
    "enijit": {
        arguments: ["vector", "vector"],
        returns: [["entity", "nil"]],
        description: "Gets an entity between two vectors.",
        tags: ["sensors"]
    },
    "esifir": {
        arguments: ["entity"],
        returns: [["block", "nil"]],
        description: "Gets the block an entity is looking at.",
        tags: ["sensors"]
    },
    "enifir": {
        arguments: ["vector", "vector"],
        returns: [["block", "nil"]],
        description: "Gets an block between two vectors.",
        tags: ["sensors"]
    },
    "esipal": {
        arguments: ["entity"],
        returns: [["vector", "nil"]],
        description: "Gets the block face an entity is looking at.",
        tags: ["sensors"]
    },
    "esipalgea": {
        arguments: ["entity"],
        returns: [["vector", "nil"]],
        description: "Gets the location of the block adjacent to the block face an entity is looking at.",
        tags: ["sensors"]
    },
    "wix": {
        arguments: ["scalar", "scalar", "vector"],
        returns: ["list"],
        description: "Gets a list of entities in a range.",
        tags: ["sensors"]
    },
    "esizon": {
        arguments: ["scalar", "scalar", "scalar", "entity"],
        returns: ["list"],
        description: "Gets a list of entities in a cone the entity is looking at.",
        tags: ["collectors"]
    },
    "esilib": {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the direction an entity is looking at.",
        tags: ["collectors"]
    },
    "gea": {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the location of an entity.",
        tags: ["collectors"]
    },
    "biegea": {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the head location of an entity.",
        tags: ["collectors"]
    },
    "firugea": {
        arguments: ["vector"],
        returns: [["block", "nil"]],
        description: "Gets a block from its location.",
        tags: ["collectors"]
    },
    "irapal": {
        arguments: ["vector", "entity"],
        returns: [["block", "nil"]],
        description: "Localize a vector to an entity.",
        tags: ["collectors"]
    },
    "debug": {
        arguments: [],
        returns: [],
        description: "Output akashic into chat.",
        tags: ["other"]
    },
    "fananim": {
        arguments: [],
        returns: [],
        description: "Output akashic into chat.",
        tags: ["other"]
    },
    "fananimver": {
        arguments: ["entity"],
        returns: [["scalar", "nil"]],
        description: "Returns the arcana amount of an entity.",
        tags: ["query"]
    },
    "het": {
        arguments: [],
        returns: ["nil"],
        description: "Returns a null cluster.",
        tags: ["constant"]
    },
    "malibhet": {
        arguments: [],
        returns: ["vector"],
        description: "Returns a [0,0,0] vector.",
        tags: ["constant"]
    },
    "malibie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an up cluster.",
        tags: ["constant"]
    },
    "malibfie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an down cluster.",
        tags: ["constant"]
    },
    "malibdie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an east cluster.",
        tags: ["constant"]
    },
    "malibcie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an west cluster.",
        tags: ["constant"]
    },
    "malibjie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an south cluster.",
        tags: ["constant"]
    },
    "malibkie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an north cluster.",
        tags: ["constant"]
    },
    "HAFOZON": {
        arguments: [],
        returns: ["scalar"],
        description: "Returns PI.",
        tags: ["constant"]
    },
    "HOLOZON": {
        arguments: [],
        returns: ["vector"],
        description: "Returns TAU (2PI).",
        tags: ["constant"]
    },
    "IRA": {
        arguments: [],
        returns: ["boolean"],
        description: "Returns true.",
        tags: ["constant"]
    },
    "IRO": {
        arguments: [],
        returns: ["boolean"],
        description: "Returns false.",
        tags: ["constant"]
    },
    "MALEME?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is sprinting, false if not.",
        tags: ["query"]
    },
    "XIBFIE?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is sneaking, false if not.",
        tags: ["query"]
    },
    "GELAQAR?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is in water, false if not.",
        tags: ["query"]
    },
    "GELACOR?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is on the ground, false if not.",
        tags: ["query"]
    },
    "MALBIE?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is jumping, false if not.",
        tags: ["query"]
    },
    "MALFIE?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is falling, false if not.",
        tags: ["query"]
    },
    "YIC?": {
        arguments: ["entity"],
        returns: ["scalar"],
        description: "Returns the hp of the entity.",
        tags: ["query"]
    },
    "EXIRER?": {
        arguments: [],
        returns: ["scalar"],
        description: "See the ouroboros loop number.",
        tags: ["query"]
    },
    "TULENI?": {
        arguments: [["entity", "block", "item"]],
        returns: [["word", "nil"]],
        description: "Returns type ID of thing.",
        tags: ["query"]
    },
    "ABIGIM?": {
        arguments: [["entity", "item"]],
        returns: [["word","nil"]],
        description: "Returns the name of thing.",
        tags: ["query"]
    },
    "TULNIM?": {
        arguments: ["item"],
        returns: ["scalar"],
        description: "Returns the stack amount of an item.",
        tags: ["query"]
    },
    "ITESULNIM?": {
        arguments: ["entity"],
        returns: ["scalar"],
        description: "Returns the player's selected slot. Returns 0 if entity is not player.",
        tags: ["query"]
    }
};
