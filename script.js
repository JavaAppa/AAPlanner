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

function createIncantTag(incant) {
    let element = document.createElement("div");
    element.classList.add("spellIncant");
    element.classList.add(...incantTypes[incant].tags);
    element.innerText = incant.toUpperCase();
    return element;
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

function addTabEvListeners(tabs, windows) {
    for(let i in tabs) {
        tabs[i].addEventListener("click", function() {
            for(let x of tabs) { x.classList.remove("sectionTitleSelected"); }
            this.classList.add("sectionTitleSelected");
            for(let x of windows) { x.classList.add("hidden"); }
            windows[i].classList.remove("hidden");
        });
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
            id("spellContainer").appendChild(createIncantTag(id("newIncantSelector").value));
        }
        id("newIncantSelector").value = "0";
    });

    addTabEvListeners(
        [id("addIncantTitle"),  id("editIncantTitle")],
        [id("addIncantWindow"), id("editIncantWindow")]
    );
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
    node: {
        "styleTag": "node",
        "name": "Node"
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
    },
    any: {
        "styleTag": "any",
        "name": "Any"
    },
    indeterminate: {
        "styleTag": "indeterminate",
        "name": "Indeterminate"
    }
};

const incantTypes = {
    "ETE": {
        arguments: [],
        returns: ["entity"],
        description: "Gets self.",
        tags: ["sensor"]
    },
    "ESIJIT": {
        arguments: ["entity"],
        returns: [["entity", "nil"]],
        description: "Gets the entity an entity is looking at.",
        tags: ["sensor"]
    },
    "ENIJIT": {
        arguments: ["vector", "vector"],
        returns: [["entity", "nil"]],
        description: "Gets an entity between two vectors.",
        tags: ["sensor"]
    },
    "ESIFIR": {
        arguments: ["entity"],
        returns: [["block", "nil"]],
        description: "Gets the block an entity is looking at.",
        tags: ["sensor"]
    },
    "ENIFIR": {
        arguments: ["vector", "vector"],
        returns: [["block", "nil"]],
        description: "Gets an block between two vectors.",
        tags: ["sensor"]
    },
    "ESIPAL": {
        arguments: ["entity"],
        returns: [["vector", "nil"]],
        description: "Gets the block face an entity is looking at.",
        tags: ["sensor"]
    },
    "ESIPALGEA": {
        arguments: ["entity"],
        returns: [["vector", "nil"]],
        description: "Gets the location of the block adjacent to the block face an entity is looking at.",
        tags: ["sensor"]
    },
    "WIX": {
        arguments: ["scalar", "scalar", "vector"],
        returns: ["list"],
        description: "Gets a list of entities in a range.",
        tags: ["sensor"]
    },
    "ESIZON": {
        arguments: ["scalar", "scalar", "scalar", "entity"],
        returns: ["list"],
        description: "Gets a list of entities in a cone the entity is looking at.",
        tags: ["collector"]
    },
    "ESILIB": {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the direction an entity is looking at.",
        tags: ["collector"]
    },
    "GEA": {
        arguments: ["entity", "block", "node"],
        returns: ["vector"],
        description: "Gets the location of an entity.",
        tags: ["collector"]
    },
    "BIEGEA": {
        arguments: ["entity"],
        returns: ["vector"],
        description: "Gets the head location of an entity.",
        tags: ["collector"]
    },
    "FIRUGEA": {
        arguments: ["vector"],
        returns: [["block", "nil"]],
        description: "Gets a block from its location.",
        tags: ["collector"]
    },
    "IRAPAL": {
        arguments: ["vector", "entity"],
        returns: [["block", "nil"]],
        description: "Localize a vector to an entity.",
        tags: ["collector"]
    },
    "DEBUG": {
        arguments: [],
        returns: [],
        description: "Output akashic into chat.",
        tags: ["other"]
    },
    "FANANIM": {
        arguments: [],
        returns: [],
        description: "Output akashic into chat.",
        tags: ["other"]
    },
    "FANANIMVER": {
        arguments: ["entity"],
        returns: [["scalar", "nil"]],
        description: "Returns the arcana amount of an entity.",
        tags: ["query"]
    },
    "HET": {
        arguments: [],
        returns: ["nil"],
        description: "Returns a null cluster.",
        tags: ["constant"]
    },
    "MALIBHET": {
        arguments: [],
        returns: ["vector"],
        description: "Returns a [0,0,0] vector.",
        tags: ["constant"]
    },
    "MALIBIE": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an up cluster.",
        tags: ["constant"]
    },
    "MALIBFIE": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an down cluster.",
        tags: ["constant"]
    },
    "MALIBDIE": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an east cluster.",
        tags: ["constant"]
    },
    "MALIBCIE": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an west cluster.",
        tags: ["constant"]
    },
    "MALIBJIE": {
        arguments: [],
        returns: ["vector"],
        description: "Returns an south cluster.",
        tags: ["constant"]
    },
    "MALIBKIE": {
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
    },
    "SINVERA": {
        arguments: [["scalar","vector","rotation"],["scalar","vector","rotation"]],
        returns: [["scalar","vector","rotation"]],
        description: "Returns the sum of two values.",
        tags: ["manipulator"]
    },
    "TOCOVER": {
        arguments: [["scalar","vector"],["scalar","vector"]],
        returns: [["scalar","vector"]],
        description: "Returns the product of two values.",
        tags: ["manipulator"]
    },
    "TOCOVAR": {
        arguments: [["scalar","vector"],["scalar","vector"]],
        returns: [["scalar","vector"]],
        description: "Returns the quotient of two values.",
        tags: ["manipulator"]
    },
    "COS": {
        arguments: ["scalar"],
        returns: ["scalar"],
        description: "Returns the cosine of a number.",
        tags: ["manipulator"]
    },
    "SIN": {
        arguments: ["scalar"],
        returns: ["scalar"],
        description: "Returns the sine of a number.",
        tags: ["manipulator"]
    },
    "TAN": {
        arguments: ["scalar"],
        returns: ["scalar"],
        description: "Returns the tangent of a number.",
        tags: ["manipulator"]
    },
    "ACOS": {
        arguments: ["scalar"],
        returns: ["scalar"],
        description: "Returns the arccosine of a number.",
        tags: ["manipulator"]
    },
    "ASIN": {
        arguments: ["scalar"],
        returns: ["scalar"],
        description: "Returns the arcsine of a number.",
        tags: ["manipulator"]
    },
    "ATAN": {
        arguments: ["scalar"],
        returns: ["scalar"],
        description: "Returns the arctangent of a number.",
        tags: ["manipulator"]
    },
    "XABAS": {
        arguments: ["any", "any"],
        returns: ["any", "any"],
        description: "Swaps the top two clusters.",
        tags: ["akashic"]
    },
    "SINJIT": {
        arguments: ["any"],
        returns: ["any", "any"],
        description: "Duplicates the top cluster.",
        tags: ["akashic"]
    },
    "YINGIM": {
        arguments: ["any"],
        returns: [],
        description: "Removes the top cluster.",
        tags: ["akashic"]
    },
    "XIBFAN": {
        arguments: ["scalar"],
        returns: [],
        description: "Delays the spell for a certain amount.",
        tags: ["akashic"]
    },
    "HUSGIM": {
        arguments: [],
        returns: [],
        description: "Prematurely halts the spell.",
        tags: ["akashic"]
    },
    "ABI": {
        arguments: [],
        returns: [],
        description: "Opens a list.",
        tags: ["list"]
    },
    "VIR": {
        arguments: [],
        returns: [],
        description: "Closes a list.",
        tags: ["list"]
    },
    "BURABI": {
        arguments: ["list"],
        returns: ["any"],
        description: "Gets the highest cluster in a list.",
        tags: ["list"]
    },
    "BURVIR": {
        arguments: ["list"],
        returns: ["any"],
        description: "Gets the lowest cluster in a list.",
        tags: ["list"]
    },
    "BURNIM": {
        arguments: ["scalar", "list"],
        returns: ["any"],
        description: "Gets a cluster in a list at an index.",
        tags: ["list"]
    },
    "BURKALAGIM": {
        arguments: ["scalar", "scalar", "list"],
        returns: ["list"],
        description: "Gets a list of clusters between two indexes in a list.",
        tags: ["list"]
    },
    "SINVERAKAL": {
        arguments: ["list", "list"],
        returns: ["list"],
        description: "Merge two lists.",
        tags: ["list"]
    },
    "XABAKAL": {
        arguments: ["list"],
        returns: ["list"],
        description: "Reverse a list.",
        tags: ["list"]
    },
    "SINAKAL": {
        arguments: ["scalar"],
        returns: ["list"],
        description: "Creates a list from the top n clusters in the akashic.",
        tags: ["list"]
    },
    "LIBAKAL": {
        arguments: ["list"],
        returns: ["scalar"],
        description: "Gets the length of a list.",
        tags: ["list"]
    },
    "YUTSINFAN": {
        arguments: ["list", "list"],
        returns: ["indeterminate"],
        description: "Cast a list over a list. If a is list 1, and b is list 2, every index of b is casted onto every index of list a.",
        tags: ["list"]
    },
    "SINFAN": {
        arguments: ["list"],
        returns: ["indeterminate"],
        description: "Cast every index of a list.",
        tags: ["list"]
    },
    "YINLIBEZON": {
        arguments: ["rotation"],
        returns: ["list"],
        description: "Converts a rotation to a list.",
        tags: ["rotation"]
    },
    "SINLIBEZON": {
        arguments: ["scalar", "scalar"],
        returns: ["rotation"],
        description: "Creates a rotation from two scalars.",
        tags: ["rotation"]
    },
    "ESILIBEZON": {
        arguments: ["entity"],
        returns: ["rotation"],
        description: "Gets a rotation from an entity.",
        tags: ["rotation"]
    },
    "MALIBEZON": {
        arguments: ["rotation", "entity"],
        returns: [],
        description: "Set the rotation of an entity.",
        tags: ["rotation"]
    },
    "HUSAWIS": {
        arguments: ["word", "word"],
        returns: ["list"],
        description: "Returns a list of the first word split by the second.",
        tags: ["word"]
    },
    "HUSASULWIS": {
        arguments: ["word"],
        returns: ["list"],
        description: "Splits a word by spaces.",
        tags: ["word"]
    },
    "SINVERAWIS": {
        arguments: ["word", "word"],
        returns: ["word"],
        description: "Concatenate two words.",
        tags: ["word"]
    },
    "IRASINWIS": {
        arguments: ["word"],
        returns: [],
        description: "Outputs to world.",
        tags: ["word"]
    },
    "SAHEJIT": {
        arguments: ["word", "entity"],
        returns: [],
        description: "Sends message to a player.",
        tags: ["word"]
    },
    "BURVIRSAH": {
        arguments: ["entity"],
        returns: ["word"],
        description: "Returns the last message that a player has sent.",
        tags: ["word"]
    },
    "SINWIS": {
        arguments: ["any"],
        returns: [],
        description: "Saves a cluster to memory.",
        tags: ["memory"]
    },
    "BURWIS": {
        arguments: [],
        returns: ["any"],
        description: "Recieves a cluster from memory.",
        tags: ["memory"]
    },
    "YINWIS": {
        arguments: [],
        returns: [],
        description: "Clear memory.",
        tags: ["memory"]
    }
};
