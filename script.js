function id(id) { return document.getElementById(id); }

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
        returns: ["entity"]
    },
    gea: {
        arguments: ["entity"],
        returns: ["vector"]
    }
};

function updateIncantSelectorUI(incant) {
    let incData = incantTypes[incant];
    console.log(incData);
    if(incData != null) {
        id("editIncantSelectedTitle").innerText = v.toUpperCase();

        id("newIncantArgumentList").innerHTML = "";
        for(let a of incData.arguments) {
            let arg = document.createElement("span");
            arg.classList.add("cluster", clusterTypes[a].styleTag);
            arg.innerText = clusterTypes[a].name;
            id("newIncantArgumentList").appendChild(arg);
        }
        id("newIncantReturnList").innerHTML = "";
        for(let r of incData.returns) {
            let ret = document.createElement("span");
            ret.classList.add("cluster", clusterTypes[r].styleTag);
            ret.innerText = clusterTypes[r].name;
            id("newIncantReturnList").appendChild(ret);
        }
    }
}

id("newIncantSelector").addEventListener("change", function() {
    let v = this.value;
    updateIncantSelectorUI(v);
    console.log(v);
});