function id(id) { return document.getElementById(id); }

function toggleSelectIncant(incant) {
    if(incant == null) {
        id("noIncantSelectedEditText").classList.remove("hidden");
        id("incantSelectedEditContent").classList.add("hidden");
    } else {
        id("noIncantSelectedEditText").classList.add("hidden");
        id("incantSelectedEditContent").classList.remove("hidden");
        if(selectedIncant) {
            selectedIncant.style.fontWeight = "";
        }
        incant.style.fontWeight = "bold";

        updateIncantSelectorUI(incant.dataset.val, {
            title: id("selectedIncantTitle"),
            args: id("selectedIncantArgumentList"),
            returns: id("selectedIncantReturnList"),
            desc: id("selectedIncantDescription")
        });
    }
    selectedIncant = incant;
}

function createClusterTag(a) {
    let arg = document.createElement("span");
    arg.classList.add("cluster", clusterTypes[a].styleTag);
    arg.innerText = clusterTypes[a].name;
    return arg;
}

function setClusterList(data, container) {
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

let draggedIncant = null;
let selectedIncant = null;
let dragOffset = [];

function updateExportSpell() {
    let text = id("exportedSpellContent");
    let children = id("spellContainer").children;
    text.value = "";
    let uncomp = [];
    for(let i of children) {
        uncomp.push(i.innerText);
    }
    text.value = uncomp.join(" ");
}

function dragIncantMouseDown(self, clientX, clientY) {
    if(selectedIncant == null || selectedIncant != self) { return; }
    draggedIncant = self;
    let bcr = self.getBoundingClientRect();
    dragOffset = [clientX - bcr.left, clientY - bcr.top];

    self.style.position = "fixed";
    self.style.left = bcr.left + "px";
    self.style.top = bcr.top + "px";
    
    self.classList.add("ignoreInArrangement");
    self.style.zIndex = "2";

    document.body.style.userSelect = "none";
    self.style.pointerEvents = "none";

    let placeholderEl = document.createElement("div");
    placeholderEl.id = "placeholderIncant";
    placeholderEl.style.width = bcr.width + "px";
    placeholderEl.innerHTML = "&nbsp;";
    placeholderEl.classList.add("spellIncant", "ignoreInArrangement");
    self.before(placeholderEl);
}

function dragIncantMouseMove(clientX, clientY) {
    if(draggedIncant != null) {
        draggedIncant.style.left = clientX - dragOffset[0] + "px";
        draggedIncant.style.top = clientY - dragOffset[1] + "px";
        
        if(id("placeholderIncant") != null) {
            arrangeIncantTo(clientX, id("placeholderIncant"));
        }
    }
}

function dragIncantMouseUp(clientX) {
    if(draggedIncant != null) {
        arrangeIncantTo(clientX, draggedIncant);
        
        draggedIncant.style.position = "";
        draggedIncant.style.pointerEvents = "";
        draggedIncant.style.zIndex = "";
        draggedIncant.classList.remove("ignoreInArrangement");
        draggedIncant = null;
        id("placeholderIncant").parentNode.removeChild(id("placeholderIncant"));

        updateExportSpell();
    }
    document.body.style.userSelect = "";
}

function createIncantTag(incant, constValue) {
    let element = document.createElement("div");
    element.classList.add("spellIncant");
    if(constValue == null) {
        element.classList.add(...incantTypes[incant].tags);
        element.dataset.val = incant;
        element.innerText = incant.toUpperCase();
    } else {
        element.dataset.val = incant;
        element.dataset.constant = true;
        element.innerText = constValue;
    }

    element.addEventListener("mousedown", function(e) {
        dragIncantMouseDown(this, e.clientX, e.clientY);
    });

    element.addEventListener("touchstart", function(e) {
        dragIncantMouseDown(this, e.touches[0].clientX, e.touches[0].clientY);
    });

    element.addEventListener("click", function(e) {
        toggleSelectIncant(this);
    });

    return element;
}

document.addEventListener("mousemove", function(e) {
    dragIncantMouseMove(e.clientX, e.clientY);
});
document.addEventListener("touchmove", function(e) {
    dragIncantMouseMove(e.touches[0].clientX, e.touches[0].clientY);
});

function arrangeIncantTo(x, elToArrange) {
    let children = id("spellContainer").children;
    let didSet = false;
    let t = "";
    for(let el of children) {
        if(el == elToArrange || el.classList.contains("ignoreInArrangement")) { continue; }
        let bcr = el.getBoundingClientRect();
        let relMousePosition = x - bcr.left - (bcr.width / 2);
        t += relMousePosition + " ";
        if(relMousePosition < 0) {
            el.before(elToArrange);
            didSet = true;
            break;
        }
    }
    if(!didSet) {
        id("spellContainer").appendChild(elToArrange);
    }  
}

document.addEventListener("mouseup", function(e) {
    dragIncantMouseUp(e.clientX);
});

document.addEventListener("touchend", function(e) {
    dragIncantMouseUp(e.changedTouches[0].clientX);
});

function updateIncantSelectorUI(incant, elements) {
    let incData = incantTypes[incant];
    if(incData != null) {
        if(elements.title) {
            elements.title.innerText = incant.toUpperCase();
        }

        if(elements.args) {
            elements.args.innerHTML = "";
            setClusterList(incData.arguments, elements.args);
        }

        if(elements.returns) {
            elements.returns.innerHTML = "";
            setClusterList(incData.returns, elements.returns);
        }

        if(elements.desc) {
            elements.desc.innerText = incData.description;
        }
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
    updateIncantSelectorUI(v, {
        title: id("editIncantSelectedTitle"),
        args: id("newIncantArgumentList"),
        returns: id("newIncantReturnList"),
        desc: id("newIncantDescription")
    });
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
        updateExportSpell();
    });

    addTabEvListeners(
        [id("addIncantTitle"),  id("addConstTitle"),  id("editIncantTitle")],
        [id("addIncantWindow"), id("addConstWindow"), id("editIncantWindow")]
    );
    addTabEvListeners(
        [id("exportSpellTitle"),     id("importSpellTitle")],
        [id("exportSpellContainer"), id("importSpellContainer")]
    );
});

id("importSpell").addEventListener("click", function(){
    let importVal = id("importedSpellContent").value.split(" ");
    for(let i in importVal) {
        if(incantTypes[importVal[i]] == null) {
            alert("Error: Incant [" + importVal[i] + "] (Placement: " + i + ") not found! Make sure there's no typos in the imported data.");
            return;
        }
    }
    for(let i of importVal) {
        id("spellContainer").appendChild(createIncantTag(i));
    }
});

id("deleteIncant").addEventListener("click", function() {
    if(selectedIncant) {
        id("spellContainer").removeChild(selectedIncant);
        updateExportSpell();
        toggleSelectIncant(null);
    }
});

id("addConstSubmit").addEventListener("click", function() {
    createIncantTag(null, id("addConstValue").value);
});

const clusterTypes = {
    entity: {"styleTag": "entity", "name": "Entity"},
    block: {"styleTag": "block", "name": "Block"},
    node: {"styleTag": "node", "name": "Node"},
    vector: {"styleTag": "vector", "name": "Vector"},
    item: {"styleTag": "item", "name": "Item"},
    rotation: {"styleTag": "rotation", "name": "Rotation"},
    word: {"styleTag": "word", "name": "Word"},
    boolean: {"styleTag": "boolean", "name": "Boolean"},
    scalar: {"styleTag": "scalar", "name": "Scalar"},
    list: {"styleTag": "list", "name": "List"},
    nil: {"styleTag": "null", "name": "Null"},
    any: {"styleTag": "any", "name": "Any"},
    indeterminate: {"styleTag": "indeterminate", "name": "Indeterminate"}
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
    },
    "SINSAH": {
        arguments: ["word", "entity"],
        returns: [],
        description: "Plays a sound to an entity.",
        tags: ["illusion"]
    },
    "BURIRO": {
        arguments: ["item", "vector"],
        returns: [],
        description: "Conjure a particle from a page at a location.",
        tags: ["illusion"]
    },
    "BURIROVER": {
        arguments: ["scalar", "item", "vector"],
        returns: [],
        description: "Conjure a particle from a grimoire's page at a location.",
        tags: ["illusion"]
    },
    "IF": {
        arguments: ["list", "list", "boolean"],
        returns: ["list"],
        description: "Returns the second list if the boolean is true, or the first list if not.",
        tags: ["logical"]
    },
    "WHEN": {
        arguments: ["list", "boolean"],
        returns: [["list", "nil"]],
        description: "Returns the list if the boolean is true, null if not.",
        tags: ["logical"]
    },
    "OR": {
        arguments: ["boolean", "boolean"],
        returns: ["boolean"],
        description: "Returns boolean one OR boolean two.",
        tags: ["logical"]
    },
    "AND": {
        arguments: ["boolean", "boolean"],
        returns: ["boolean"],
        description: "Returns boolean one AND boolean two.",
        tags: ["logical"]
    },
    "NOT": {
        arguments: ["boolean"],
        returns: ["boolean"],
        description: "Returns the opposite boolean as the one given.",
        tags: ["logical"]
    },
    "JIT": {
        arguments: ["any", "any"],
        returns: ["boolean"],
        description: "Returns whether the two values are equal to each other.",
        tags: ["logical"]
    },
    "IRAJIT": {
        arguments: ["any", "any"],
        returns: ["boolean"],
        description: "Returns a precise evaluation of whether the two values are equal to each other.",
        tags: ["logical"]
    },
    "IROJIT": {
        arguments: ["boolean", "boolean"],
        returns: ["boolean"],
        description: "Returns Whether the two values are the same type.",
        tags: ["logical"]
    },
    "JIRVAR": {
        arguments: ["scalar", "scalar"],
        returns: ["boolean"],
        description: "Returns whether scalar 2 is less than scalar 1.",
        tags: ["logical"]
    },
    "JIRVARJIT": {
        arguments: ["scalar", "scalar"],
        returns: ["boolean"],
        description: "Returns whether scalar 2 is less than or equal to scalar 1.",
        tags: ["logical"]
    },
    "JIRVER": {
        arguments: ["scalar", "scalar"],
        returns: ["boolean"],
        description: "Returns whether scalar 2 is greater than scalar 1.",
        tags: ["logical"]
    },
    "JIRVERJIT": {
        arguments: ["scalar", "scalar"],
        returns: ["boolean"],
        description: "Returns whether scalar 2 is greater than or equal to scalar 1.",
        tags: ["logical"]
    },
    "SINAFIL": {
        arguments: ["scalar", "scalar", "scalar"],
        returns: ["vector"],
        description: "Converts 3 numbers to a vector.",
        tags: ["vector"]
    },
    "YINAFIL": {
        arguments: ["vector"],
        returns: ["scalar", "scalar", "scalar"],
        description: "Converts a vector to 3 numbers.",
        tags: ["vector"]
    },
    "LIBAFIL": {
        arguments: ["vector"],
        returns: ["scalar"],
        description: "Gets the magnitude of a vector.",
        tags: ["vector"]
    },
    "LIBAS": {
        arguments: ["vector", "vector"],
        returns: ["scalar"],
        description: "Gets the distance between two vectors.",
        tags: ["vector"]
    },
    "IROKIE": {
        arguments: ["vector"],
        returns: ["vector"],
        description: "Round a vector.",
        tags: ["vector"]
    },
    "IRANIM": {
        arguments: ["scalar"],
        returns: ["scalar"],
        description: "Get the absolute value of a number.",
        tags: ["number"]
    },
    "IRONIM": {
        arguments: ["scalar"],
        returns: ["scalar"],
        description: "Round a number.",
        tags: ["number"]
    },
    "PAQANIM": {
        arguments: [],
        returns: ["scalar"],
        description: "Get a random number from 0 to 1.",
        tags: ["number"]
    },
    "IRONIMVAR": {
        arguments: ["scalar"],
        returns: ["scalar"],
        description: "Round a number down.",
        tags: ["number"]
    },
    "IRONIMVER": {
        arguments: [],
        returns: ["scalar"],
        description: "Round a number up.",
        tags: ["number"]
    },
    "BURITE": {
        arguments: ["scalar", ["entity", "block"]],
        returns: ["item"],
        description: "Get an item from an entity / block's inventory.",
        tags: ["item"]
    },
    "BURFANITE": {
        arguments: ["item"],
        returns: ["list"],
        description: "Get a spell from an item.",
        tags: ["item"]
    },
    "MALITE": {
        arguments: [["entity", "block"], ["entity", "block"], "scalar"],
        returns: ["boolean"],
        description: "Transfer item between two entities/blocks. NOTE: Do not mix up with XABITE, which swaps two items in the SAME entity/block's inventory.",
        tags: ["item"]
    },
    "XABITE": {
        arguments: ["scalar", "scalar", ["entity", "block"]],
        returns: ["boolean"],
        description: "Swap two items in an entity/block's inventory. NOTE: Do not mix up with MALITE, which transfers items between two DIFFERENT entities.",
        tags: ["item"]
    },
    "HESITE": {
        arguments: ["item"],
        returns: [],
        description: "Repair an item.",
        tags: ["item"]
    },
    "PALACOR": {
        arguments: ["vector", "vector"],
        returns: ["list"],
        description: "Get all vectors between two positions in an area.",
        tags: ["area"]
    },
    "FILACOR": {
        arguments: ["vector", "vector"],
        returns: ["list"],
        description: "Get all vectors between two positions in a line.",
        tags: ["area"]
    },
    "YINSOX": {
        arguments: ["word"],
        returns: [],
        description: "Purge mark.",
        tags: ["mark"]
    },
    "WISSOX": {
        arguments: [["entity", "vector", "block", "word", "item", "rotation", "scalar"], "word"],
        returns: [],
        description: "Create a mark.",
        tags: ["mark"]
    },
    "BURSOX": {
        arguments: ["word"],
        returns: ["any"],
        description: "Get a mark from a word.",
        tags: ["mark"]
    },
    "SEMAYIQ": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict poison onto an entity.",
        tags: ["alchemical"]
    },
    "MALBASCOR": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict levitation onto an entity.",
        tags: ["alchemical"]
    },
    "REDESI": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict blindness onto an entity.",
        tags: ["alchemical"]
    },
    "MALVARYIQ": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict hunger onto an entity.",
        tags: ["alchemical"]
    },
    "MALVAR": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict slowness onto an entity.",
        tags: ["alchemical"]
    },
    "YIXYIQ": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict withering onto an entity.",
        tags: ["alchemical"]
    },
    "ABRACADABRA": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict nausea onto an entity.",
        tags: ["alchemical"]
    },
    "HESAYIC": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict regeneration onto an entity.",
        tags: ["alchemical"]
    },
    "MALBIE": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict jump boost onto an entity.",
        tags: ["alchemical"]
    },
    "MALFIEVAR": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict slow falling onto an entity.",
        tags: ["alchemical"]
    },
    "ESIEME": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict night vision onto an entity.",
        tags: ["alchemical"]
    },
    "XABESI": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict invisiblity onto an entity.",
        tags: ["alchemical"]
    },
    "MALVER": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict speed onto an entity.",
        tags: ["alchemical"]
    },
    "YINILIC": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict haste onto an entity.",
        tags: ["alchemical"]
    },
    "BISCUL": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict fire resistance onto an entity.",
        tags: ["alchemical"]
    },
    "QARCUL": {
        arguments: ["scalar", "scalar", "boolean", "entity"],
        returns: [],
        description: "Inflict water breathing onto an entity.",
        tags: ["alchemical"]
    },
    "FUS": {
        arguments: [["vector", "entity"]],
        returns: [],
        description: "Conjure a persistent ball of light at the vector given OR flashbang a player.",
        tags: ["elemental"]
    },
    "BIS": {
        arguments: [["vector", "entity"]],
        returns: [],
        description: "Start a fire, melt a frozen block, force a creeper to explode.",
        tags: ["elemental"]
    },
    "MALBIZON": {
        arguments: ["vector", "vector"],
        returns: ["entity"],
        description: "\"I CAST FIREBALL!\" - Last words of a mage who casted fireball in an enclosed space. Summon a moving fire charge at a vector moving in a direction. Return the fireball as a cluster.",
        tags: ["elemental"]
    },
    "MALQARZON": {
        arguments: ["vector", "vector"],
        returns: ["entity"],
        description: "Summon a snowball at a position moving in a direction.",
        tags: ["elemental"]
    },
    "MALFICZON": {
        arguments: ["vector", "vector"],
        returns: ["entity"],
        description: "Summon a wind charge at a position moving in a direction.",
        tags: ["elemental"]
    },
    "QAR": {
        arguments: [["Vector", "Entity"]],
        returns: ["entity"],
        description: "Conjure water at a location, extinguish flames, stop a creeper from exploding.",
        tags: ["elemental"]
    },
    "QARHES": {
        arguments: ["Entity"],
        returns: ["entity"],
        description: "Stop a creeper from exploding. Seemingly the same as QAR.",
        tags: ["elemental"]
    },
    "QARILIC": {
        arguments: [["vector", "entity"]],
        returns: [],
        description: "Freeze a block, inflict ice damage on an entity.",
        tags: ["elemental"]
    },
    "SINBASHUS": {
        arguments: ["vector"],
        returns: [],
        description: "Summon a lightning bolt.",
        tags: ["elemental"]
    },
    "SINBASHUS": {
        arguments: ["vector", "entity"],
        returns: [],
        description: "Summon a lightning line.",
        tags: ["elemental"]
    },
    "BISILIC": {
        arguments: ["boolean", "boolean", "scalar", "vector"],
        returns: [],
        description: "I am become death, destroyer of worlds. (summon explosion)",
        tags: ["elemental"]
    },
    "GIMALIS": {
        arguments: ["list", "vector", "vector"],
        returns: ["entity"],
        description: "Conjure a projectile.",
        tags: ["energetic"]
    },
    "MALIS": {
        arguments: ["list", "vector", "vector"],
        returns: ["entity"],
        description: "Conjure a projectile that's affected by gravity.",
        tags: ["energetic"]
    },
    "MAL": {
        arguments: ["vector", ["entity", "vector"]],
        returns: [],
        description: "Punt an entity or a block at a location.",
        tags: ["kinetic"]
    },
    "MALJIE": {
        arguments: ["vector", "scalar", "scalar", "entity"],
        returns: [],
        description: "Apply knockback to an entity.",
        tags: ["kinetic"]
    },
    "MALFAN": {
        arguments: ["scalar", "entity"],
        returns: [],
        description: "Teleport an entity forward a certain distance.",
        tags: ["spatial"]
    },
    "MALFANEME": {
        arguments: ["vector", "entity"],
        returns: [],
        description: "Teleport an entity to a location.",
        tags: ["spatial"]
    },
    "HUSCOR": {
        arguments: ["vector"],
        returns: [],
        description: "Break a block.",
        tags: ["blockwork"]
    },
    "SINCOR": {
        arguments: ["vector", "item"],
        returns: [],
        description: "Place a block from an item.",
        tags: ["blockwork"]
    },
    "MALCOR": {
        arguments: ["vector", "vector"],
        returns: [],
        description: "Swap two blocks.",
        tags: ["blockwork"]
    }
};
