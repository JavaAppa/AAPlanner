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
    gea: {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the location of an entity."
    }
};
