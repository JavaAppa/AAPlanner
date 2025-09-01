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
    ete: {
        arguments: ["nil"],
        returns: ["entity"],
        description: "Gets self."
    },
    esijit: {
        arguments: ["entity"],
        returns: [["entity", "nil"]],
        description: "Gets the entity an entity is looking at."
    },
    enijit: {
        arguments: ["vector", "vector"],
        returns: [["entity", "nil"]],
        description: "Gets an entity between two vectors."
    },
    esifir: {
        arguments: ["entity"],
        returns: [["block", "nil"]],
        description: "Gets the block an entity is looking at."
    },
    enifir: {
        arguments: ["vector", "vector"],
        returns: [["block", "nil"]],
        description: "Gets an block between two vectors."
    },
    esipal: {
        arguments: ["entity"],
        returns: [["vector", "nil"]],
        description: "Gets the block face an entity is looking at."
    },
    esipalgea: {
        arguments: ["entity"],
        returns: [["vector", "nil"]],
        description: "Gets the location of the block adjacent to the block face an entity is looking at."
    },
    wix: {
        arguments: ["scalar", "scalar", "vector"],
        returns: ["list"],
        description: "Gets a list of entities in a range."
    },
    esizon: {
        arguments: ["scalar", "scalar", "scalar", "entity"],
        returns: ["list"],
        description: "Gets a list of entities in a cone the entity is looking at."
    },
    esilib: {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the direction an entity is looking at."
    },
    gea: {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the location of an entity."
    },
    biegea: {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the head location of an entity."
    },
    firugea: {
        arguments: ["vector"],
        returns: [["block", "nil"]],
        description: "Gets a block from its location."
    },
    irapal: {
        arguments: ["vector", "entity"],
        returns: [["block", "nil"]],
        description: "Localize a vector to an entity."
    },
    debug: {
        arguments: ["nil"],
        returns: ["nil"],
        description: "Output akashic into chat."
    }
};
