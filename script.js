function id(id) { return document.getElementById(id); }

function createClusterTag(a) {
    let arg = document.createElement("span");
    arg.classList.add("cluster", clusterTypes[a].styleTag);
    arg.innerText = clusterTypes[a].name;
    return arg;
}

function setClusterList(data, container) {
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
    if(data.length == 0) {
        container.innerText = "None found.";
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
        description: "Gets self."
    },
    "esijit": {
        arguments: ["entity"],
        returns: [["entity", "nil"]],
        description: "Gets the entity an entity is looking at."
    },
    "enijit": {
        arguments: ["vector", "vector"],
        returns: [["entity", "nil"]],
        description: "Gets an entity between two vectors."
    },
    "esifir": {
        arguments: ["entity"],
        returns: [["block", "nil"]],
        description: "Gets the block an entity is looking at."
    },
    "enifir": {
        arguments: ["vector", "vector"],
        returns: [["block", "nil"]],
        description: "Gets an block between two vectors."
    },
    "esipal": {
        arguments: ["entity"],
        returns: [["vector", "nil"]],
        description: "Gets the block face an entity is looking at."
    },
    "esipalgea": {
        arguments: ["entity"],
        returns: [["vector", "nil"]],
        description: "Gets the location of the block adjacent to the block face an entity is looking at."
    },
    "wix": {
        arguments: ["scalar", "scalar", "vector"],
        returns: ["list"],
        description: "Gets a list of entities in a range."
    },
    "esizon": {
        arguments: ["scalar", "scalar", "scalar", "entity"],
        returns: ["list"],
        description: "Gets a list of entities in a cone the entity is looking at."
    },
    "esilib": {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the direction an entity is looking at."
    },
    "gea": {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the location of an entity."
    },
    "biegea": {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the head location of an entity."
    },
    "firugea": {
        arguments: ["vector"],
        returns: [["block", "nil"]],
        description: "Gets a block from its location."
    },
    "irapal": {
        arguments: ["vector", "entity"],
        returns: [["block", "nil"]],
        description: "Localize a vector to an entity."
    },
    "debug": {
        arguments: [],
        returns: [],
        description: "Output akashic into chat."
    },
    "fananim": {
        arguments: [],
        returns: [],
        description: "Output akashic into chat."
    },
    "fananimver": {
        arguments: ["entity"],
        returns: [["scalar", "nil"]],
        description: "Output arcana amount of an entity"
    },
    "het": {
        arguments: [],
        returns: ["nil"],
        description: "Returns a null cluster."
    },
    "malibhet": {
        arguments: [],
        returns: ["vector"],
        description: "Returns a [0,0,0] vector."
    },
    "malibie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an up cluster."
    },
    "malibfie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an down cluster."
    },
    "malibdie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an east cluster."
    },
    "malibcie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an west cluster."
    },
    "malibjie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an south cluster."
    },
    "malibkie": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an north cluster."
    },
    "HAFOZON": {
        arguments: [],
        returns: ["scalar"],
        description: "Returns PI."
    },
    "HOLOZON": {
        arguments: [],
        returns: ["vector"],
        description: "Returns TAU (2PI)."
    },
    "IRA": {
        arguments: [],
        returns: ["boolean"],
        description: "Returns true."
    },
    "IRO": {
        arguments: [],
        returns: ["boolean"],
        description: "Returns false."
    },
    "MALEME?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is sprinting, false if not."
    },
    "XIBFIE?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is sneaking, false if not."
    },
    "GELAQAR?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is in water, false if not."
    },
    "GELACOR?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is on the ground, false if not."
    },
    "MALBIE?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is jumping, false if not."
    },
    "MALFIE?": {
        arguments: ["entity"],
        returns: ["boolean"],
        description: "Returns true if the entity is falling, false if not."
    },
    "YIC?": {
        arguments: ["entity"],
        returns: ["scalar"],
        description: "Returns the hp of the entity."
    },
    "EXIRER?": {
        arguments: [],
        returns: ["scalar"],
        description: "See the ouroboros loop number."
    },
    "TULENI?": {
        arguments: [["entity", "block", "item"]],
        returns: [["word", "nil"]],
        description: "Returns type ID of thing."
    },
    "ABIGIM?": {
        arguments: [["entity", "item"]],
        returns: [["word" "nil"]],
        description: "Returns the name of thing."
    },
    "TULNIM?": {
        arguments: ["item"],
        returns: ["scalar"],
        description: "Returns the stack amount of an item."
    },
    "ITESULNIM?": {
        arguments: ["entity"],
        returns: ["number"],
        description: "Returns the player's selected slot. Returns 0 if entity is not player."
    }
};
