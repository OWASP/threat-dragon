;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
    "use strict";
    var nools = require("../");

    if (typeof Object.getPrototypeOf !== "function") {
        Object.getPrototypeOf = "".__proto__ === String.prototype
            ? function (object) {
            return object.__proto__;
        }
            : function (object) {
            // May break if the constructor has been tampered with
            return object.constructor.prototype;
        };
    }

    if ("function" === typeof this.define && this.define.amd) {
        define([], function () {
            return nools;
        });
    } else {
        this.nools = nools;
    }
}).call(typeof window !== "undefined" ? window : this);

},{"../":2}],2:[function(require,module,exports){
module.exports = exports = require("./lib");
},{"./lib":15}],3:[function(require,module,exports){
"use strict";
var extd = require("./extended"),
    declare = extd.declare,
    AVLTree = extd.AVLTree,
    LinkedList = extd.LinkedList,
    isPromise = extd.isPromiseLike,
    EventEmitter = require("events").EventEmitter;


var FactHash = declare({
    instance: {
        constructor: function () {
            this.memory = {};
            this.memoryValues = new LinkedList();
        },

        clear: function () {
            this.memoryValues.clear();
            this.memory = {};
        },


        remove: function (v) {
            var hashCode = v.hashCode,
                memory = this.memory,
                ret = memory[hashCode];
            if (ret) {
                this.memoryValues.remove(ret);
                delete memory[hashCode];
            }
            return ret;
        },

        insert: function (insert) {
            var hashCode = insert.hashCode;
            if (hashCode in this.memory) {
                throw new Error("Activation already in agenda " + insert.rule.name + " agenda");
            }
            this.memoryValues.push((this.memory[hashCode] = insert));
        }
    }
});


var DEFAULT_AGENDA_GROUP = "main";
module.exports = declare(EventEmitter, {

    instance: {
        constructor: function (flow, conflictResolution) {
            this.agendaGroups = {};
            this.agendaGroupStack = [DEFAULT_AGENDA_GROUP];
            this.rules = {};
            this.flow = flow;
            this.comparator = conflictResolution;
            this.setFocus(DEFAULT_AGENDA_GROUP).addAgendaGroup(DEFAULT_AGENDA_GROUP);
        },

        addAgendaGroup: function (groupName) {
            if (!extd.has(this.agendaGroups, groupName)) {
                this.agendaGroups[groupName] = new AVLTree({compare: this.comparator});
            }
        },

        getAgendaGroup: function (groupName) {
            return this.agendaGroups[groupName || DEFAULT_AGENDA_GROUP];
        },

        setFocus: function (agendaGroup) {
            if (agendaGroup !== this.getFocused()) {
                this.agendaGroupStack.push(agendaGroup);
                this.emit("focused", agendaGroup);
            }
            return this;
        },

        getFocused: function () {
            var ags = this.agendaGroupStack;
            return ags[ags.length - 1];
        },

        getFocusedAgenda: function () {
            return this.agendaGroups[this.getFocused()];
        },

        register: function (node) {
            var agendaGroup = node.rule.agendaGroup;
            this.rules[node.name] = {tree: new AVLTree({compare: this.comparator}), factTable: new FactHash()};
            if (agendaGroup) {
                this.addAgendaGroup(agendaGroup);
            }
        },

        isEmpty: function () {
            var agendaGroupStack = this.agendaGroupStack, changed = false;
            while (this.getFocusedAgenda().isEmpty() && this.getFocused() !== DEFAULT_AGENDA_GROUP) {
                agendaGroupStack.pop();
                changed = true;
            }
            if (changed) {
                this.emit("focused", this.getFocused());
            }
            return this.getFocusedAgenda().isEmpty();
        },

        fireNext: function () {
            var agendaGroupStack = this.agendaGroupStack, ret = false;
            while (this.getFocusedAgenda().isEmpty() && this.getFocused() !== DEFAULT_AGENDA_GROUP) {
                agendaGroupStack.pop();
            }
            if (!this.getFocusedAgenda().isEmpty()) {
                var activation = this.pop();
                this.emit("fire", activation.rule.name, activation.match.factHash);
                var fired = activation.rule.fire(this.flow, activation.match);
                if (isPromise(fired)) {
                    ret = fired.then(function () {
                        //return true if an activation fired
                        return true;
                    });
                } else {
                    ret = true;
                }
            }
            //return false if activation not fired
            return ret;
        },

        pop: function () {
            var tree = this.getFocusedAgenda(), root = tree.__root;
            while (root.right) {
                root = root.right;
            }
            var v = root.data;
            tree.remove(v);
            var rule = this.rules[v.name];
            rule.tree.remove(v);
            rule.factTable.remove(v);
            return v;
        },

        peek: function () {
            var tree = this.getFocusedAgenda(), root = tree.__root;
            while (root.right) {
                root = root.right;
            }
            return root.data;
        },

        modify: function (node, context) {
            this.retract(node, context);
            this.insert(node, context);
        },

        retract: function (node, retract) {
            var rule = this.rules[node.name];
            retract.rule = node;
            var activation = rule.factTable.remove(retract);
            if (activation) {
                this.getAgendaGroup(node.rule.agendaGroup).remove(activation);
                rule.tree.remove(activation);
            }
        },

        insert: function (node, insert) {
            var rule = this.rules[node.name], nodeRule = node.rule, agendaGroup = nodeRule.agendaGroup;
            rule.tree.insert(insert);
            this.getAgendaGroup(agendaGroup).insert(insert);
            if (agendaGroup) {
                if (nodeRule.autoFocus) {
                    this.setFocus(agendaGroup);
                }
            }

            rule.factTable.insert(insert);
        },

        dispose: function () {
            for (var i in this.agendaGroups) {
                this.agendaGroups[i].clear();
            }
            var rules = this.rules;
            for (i in rules) {
                if (i in rules) {
                    rules[i].tree.clear();
                    rules[i].factTable.clear();

                }
            }
            this.rules = {};
        }
    }

});
},{"./extended":12,"events":60}],4:[function(require,module,exports){
/*jshint evil:true*/
"use strict";
var extd = require("../extended"),
    forEach = extd.forEach,
    isString = extd.isString;

exports.modifiers = ["assert", "modify", "retract", "emit", "halt", "focus", "getFacts"];

var createFunction = function (body, defined, scope, scopeNames, definedNames) {
    var declares = [];
    forEach(definedNames, function (i) {
        if (body.indexOf(i) !== -1) {
            declares.push("var " + i + "= defined." + i + ";");
        }
    });

    forEach(scopeNames, function (i) {
        if (body.indexOf(i) !== -1) {
            declares.push("var " + i + "= scope." + i + ";");
        }
    });
    body = ["((function(){", declares.join(""), "\n\treturn ", body, "\n})())"].join("");
    try {
        return eval(body);
    } catch (e) {
        throw new Error("Invalid action : " + body + "\n" + e.message);
    }
};

var createDefined = (function () {

    var _createDefined = function (action, defined, scope) {
        if (isString(action)) {
            var declares = [];
            extd(defined).keys().forEach(function (i) {
                if (action.indexOf(i) !== -1) {
                    declares.push("var " + i + "= defined." + i + ";");
                }
            });

            extd(scope).keys().forEach(function (i) {
                if (action.indexOf(i) !== -1) {
                    declares.push("var " + i + "= function(){var prop = scope." + i + "; return __objToStr__.call(prop) === '[object Function]' ? prop.apply(void 0, arguments) : prop;};");
                }
            });
            if (declares.length) {
                declares.unshift("var __objToStr__ = Object.prototype.toString;");
            }
            action = [declares.join(""), "return ", action, ";"].join("");
            action = new Function("defined", "scope", action)(defined, scope);
        }
        var ret = action.hasOwnProperty("constructor") && "function" === typeof action.constructor ? action.constructor : function (opts) {
            opts = opts || {};
            for (var i in opts) {
                if (i in action) {
                    this[i] = opts[i];
                }
            }
        };
        var proto = ret.prototype;
        for (var i in action) {
            proto[i] = action[i];
        }
        return ret;

    };

    return function (options, defined, scope) {
        return _createDefined(options.properties, defined, scope);
    };
})();

exports.createFunction = createFunction;
exports.createDefined = createDefined;
},{"../extended":12}],5:[function(require,module,exports){
var Buffer=require("__browserify_Buffer").Buffer;/*jshint evil:true*/
"use strict";
var extd = require("../extended"),
    parser = require("../parser"),
    constraintMatcher = require("../constraintMatcher.js"),
    indexOf = extd.indexOf,
    forEach = extd.forEach,
    removeDuplicates = extd.removeDuplicates,
    map = extd.map,
    obj = extd.hash,
    keys = obj.keys,
    merge = extd.merge,
    rules = require("../rule"),
    common = require("./common"),
    modifiers = common.modifiers,
    createDefined = common.createDefined,
    createFunction = common.createFunction;


/**
 * @private
 * Parses an action from a rule definition
 * @param {String} action the body of the action to execute
 * @param {Array} identifiers array of identifiers collected
 * @param {Object} defined an object of defined
 * @param scope
 * @return {Object}
 */
var parseAction = function (action, identifiers, defined, scope) {
    var declares = [];
    forEach(identifiers, function (i) {
        if (action.indexOf(i) !== -1) {
            declares.push("var " + i + "= facts." + i + ";");
        }
    });
    extd(defined).keys().forEach(function (i) {
        if (action.indexOf(i) !== -1) {
            declares.push("var " + i + "= defined." + i + ";");
        }
    });

    extd(scope).keys().forEach(function (i) {
        if (action.indexOf(i) !== -1) {
            declares.push("var " + i + "= scope." + i + ";");
        }
    });
    extd(modifiers).forEach(function (i) {
        if (action.indexOf(i) !== -1) {
            declares.push("if(!" + i + "){ var " + i + "= flow." + i + ";}");
        }
    });
    var params = ["facts", 'flow'];
    if (/next\(.*\)/.test(action)) {
        params.push("next");
    }
    action = declares.join("") + action;
    try {
        return new Function("defined, scope", "return " + new Function(params.join(","), action).toString())(defined, scope);
    } catch (e) {
        throw new Error("Invalid action : " + action + "\n" + e.message);
    }
};

var createRuleFromObject = (function () {
    var __resolveRule = function (rule, identifiers, conditions, defined, name) {
        var condition = [], definedClass = rule[0], alias = rule[1], constraint = rule[2], refs = rule[3];
        if (extd.isHash(constraint)) {
            refs = constraint;
            constraint = null;
        }
        if (definedClass && !!(definedClass = defined[definedClass])) {
            condition.push(definedClass);
        } else {
            throw new Error("Invalid class " + rule[0] + " for rule " + name);
        }
        condition.push(alias, constraint, refs);
        conditions.push(condition);
        identifiers.push(alias);
        if (constraint) {
            forEach(constraintMatcher.getIdentifiers(parser.parseConstraint(constraint)), function (i) {
                identifiers.push(i);
            });
        }
        if (extd.isObject(refs)) {
            for (var j in refs) {
                var ident = refs[j];
                if (indexOf(identifiers, ident) === -1) {
                    identifiers.push(ident);
                }
            }
        }
    };

    function parseRule(rule, conditions, identifiers, defined, name) {
        if (rule.length) {
            var r0 = rule[0];
            if (r0 === "not" || r0 === "exists") {
                var temp = [];
                rule.shift();
                __resolveRule(rule, identifiers, temp, defined, name);
                var cond = temp[0];
                cond.unshift(r0);
                conditions.push(cond);
            } else if (r0 === "or") {
                var conds = [r0];
                rule.shift();
                forEach(rule, function (cond) {
                    parseRule(cond, conds, identifiers, defined, name);
                });
                conditions.push(conds);
            } else {
                __resolveRule(rule, identifiers, conditions, defined, name);
                identifiers = removeDuplicates(identifiers);
            }
        }

    }

    return function (obj, defined, scope) {
        var name = obj.name;
        if (extd.isEmpty(obj)) {
            throw new Error("Rule is empty");
        }
        var options = obj.options || {};
        options.scope = scope;
        var constraints = obj.constraints || [], l = constraints.length;
        if (!l) {
            constraints = ["true"];
        }
        var action = obj.action;
        if (extd.isUndefined(action)) {
            throw new Error("No action was defined for rule " + name);
        }
        var conditions = [], identifiers = [];
        forEach(constraints, function (rule) {
            parseRule(rule, conditions, identifiers, defined, name);
        });
        return rules.createRule(name, options, conditions, parseAction(action, identifiers, defined, scope));
    };
})();

exports.parse = function (src, file) {
    //parse flow from file
    return parser.parseRuleSet(src, file);

};
exports.compile = function (flowObj, options, cb, Container) {
    if (extd.isFunction(options)) {
        cb = options;
        options = {};
    } else {
        options = options || {};
        cb = null;
    }
    var name = flowObj.name || options.name;
    //if !name throw an error
    if (!name) {
        throw new Error("Name must be present in JSON or options");
    }
    var flow = new Container(name);
    var defined = merge({Array: Array, String: String, Number: Number, Boolean: Boolean, RegExp: RegExp, Date: Date, Object: Object}, options.define || {});
    if (typeof Buffer !== "undefined") {
        defined.Buffer = Buffer;
    }
    var scope = merge({console: console}, options.scope);
    //add the anything added to the scope as a property
    forEach(flowObj.scope, function (s) {
        scope[s.name] = true;
    });
    //add any defined classes in the parsed flowObj to defined
    forEach(flowObj.define, function (d) {
        defined[d.name] = createDefined(d, defined, scope);
    });

    //expose any defined classes to the flow.
    extd(defined).forEach(function (cls, name) {
        flow.addDefined(name, cls);
    });

    var scopeNames = extd(flowObj.scope).pluck("name").union(extd(scope).keys().value()).value();
    var definedNames = map(keys(defined), function (s) {
        return s;
    });
    forEach(flowObj.scope, function (s) {
        scope[s.name] = createFunction(s.body, defined, scope, scopeNames, definedNames);
    });
    var rules = flowObj.rules;
    if (rules.length) {
        forEach(rules, function (rule) {
            flow.__rules = flow.__rules.concat(createRuleFromObject(rule, defined, scope));
        });
    }
    if (cb) {
        cb.call(flow, flow);
    }
    return flow;
};

exports.transpile = require("./transpile").transpile;




},{"../constraintMatcher.js":9,"../extended":12,"../parser":44,"../rule":49,"./common":4,"./transpile":6,"__browserify_Buffer":63}],6:[function(require,module,exports){
var Buffer=require("__browserify_Buffer").Buffer;var extd = require("../extended"),
    forEach = extd.forEach,
    indexOf = extd.indexOf,
    merge = extd.merge,
    isString = extd.isString,
    modifiers = require("./common").modifiers,
    constraintMatcher = require("../constraintMatcher"),
    parser = require("../parser");

function definedToJs(options) {
    /*jshint evil:true*/
    options = isString(options) ? new Function("return " + options + ";")() : options;
    var ret = ["(function(){"], value;

    if (options.hasOwnProperty("constructor") && "function" === typeof options.constructor) {
        ret.push("var Defined = " + options.constructor.toString() + ";");
    } else {
        ret.push("var Defined = function(opts){ for(var i in opts){if(opts.hasOwnProperty(i)){this[i] = opts[i];}}};");
    }
    ret.push("var proto = Defined.prototype;");
    for (var key in options) {
        if (options.hasOwnProperty(key)) {
            value = options[key];
            ret.push("proto." + key + " = " + (extd.isFunction(value) ? value.toString() : extd.format("%j", value)) + ";");
        }
    }
    ret.push("return Defined;");
    ret.push("}())");
    return ret.join("");

}

function actionToJs(action, identifiers, defined, scope) {
    var declares = [], usedVars = {};
    forEach(identifiers, function (i) {
        if (action.indexOf(i) !== -1) {
            usedVars[i] = true;
            declares.push("var " + i + "= facts." + i + ";");
        }
    });
    extd(defined).keys().forEach(function (i) {
        if (action.indexOf(i) !== -1 && !usedVars[i]) {
            usedVars[i] = true;
            declares.push("var " + i + "= defined." + i + ";");
        }
    });

    extd(scope).keys().forEach(function (i) {
        if (action.indexOf(i) !== -1 && !usedVars[i]) {
            usedVars[i] = true;
            declares.push("var " + i + "= scope." + i + ";");
        }
    });
    extd(modifiers).forEach(function (i) {
        if (action.indexOf(i) !== -1 && !usedVars[i]) {
            declares.push("var " + i + "= flow." + i + ";");
        }
    });
    var params = ["facts", 'flow'];
    if (/next\(.*\)/.test(action)) {
        params.push("next");
    }
    action = declares.join("") + action;
    try {
        return ["function(", params.join(","), "){", action, "}"].join("");
    } catch (e) {
        throw new Error("Invalid action : " + action + "\n" + e.message);
    }
}

function parseConstraintModifier(constraint, ret) {
    if (constraint.length && extd.isString(constraint[0])) {
        var modifier = constraint[0].match(" *(from)");
        if (modifier) {
            modifier = modifier[0];
            switch (modifier) {
            case "from":
                ret.push(', "', constraint.shift(), '"');
                break;
            default:
                throw new Error("Unrecognized modifier " + modifier);
            }
        }
    }
}

function parseConstraintHash(constraint, ret, identifiers) {
    if (constraint.length && extd.isHash(constraint[0])) {
        //ret of options
        var refs = constraint.shift();
        extd(refs).values().forEach(function (ident) {
            if (indexOf(identifiers, ident) === -1) {
                identifiers.push(ident);
            }
        });
        ret.push(',' + extd.format('%j', [refs]));
    }
}

function constraintsToJs(constraint, identifiers) {
    constraint = constraint.slice(0);
    var ret = [];
    if (constraint[0] === "or") {
        ret.push('["' + constraint.shift() + '"');
        ret.push(extd.map(constraint,function (c) {
            return constraintsToJs(c, identifiers);
        }).join(",") + "]");
        return ret;
    } else if (constraint[0] === "not" || constraint[0] === "exists") {
        ret.push('"', constraint.shift(), '", ');
    }
    identifiers.push(constraint[1]);
    ret.push(constraint[0], ', "' + constraint[1].replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + '"');
    constraint.splice(0, 2);
    if (constraint.length) {
        //constraint
        var c = constraint.shift();
        if (extd.isString(c) && c) {
            ret.push(',"' + c.replace(/\\/g, "\\\\").replace(/"/g, "\\\""), '"');
            forEach(constraintMatcher.getIdentifiers(parser.parseConstraint(c)), function (i) {
                identifiers.push(i);
            });
        } else {
            ret.push(',"true"');
            constraint.unshift(c);
        }
    }
    parseConstraintModifier(constraint, ret);
    parseConstraintHash(constraint, ret, identifiers);
    return '[' + ret.join("") + ']';
}

exports.transpile = function (flowObj, options) {
    options = options || {};
    var ret = [];
    ret.push("(function(){");
    ret.push("return function(options){");
    ret.push("options = options || {};");
    ret.push("var bind = function(scope, fn){return function(){return fn.apply(scope, arguments);};}, defined = {Array: Array, String: String, Number: Number, Boolean: Boolean, RegExp: RegExp, Date: Date, Object: Object}, scope = options.scope || {};");
    ret.push("var optDefined = options.defined || {}; for(var i in optDefined){defined[i] = optDefined[i];}");
    var defined = merge({Array: Array, String: String, Number: Number, Boolean: Boolean, RegExp: RegExp, Date: Date, Object: Object}, options.define || {});
    if (typeof Buffer !== "undefined") {
        defined.Buffer = Buffer;
    }
    var scope = merge({console: console}, options.scope);
    ret.push(["return nools.flow('", options.name, "', function(){"].join(""));
    //add any defined classes in the parsed flowObj to defined
    ret.push(extd(flowObj.define || []).map(function (defined) {
        var name = defined.name;
        defined[name] = {};
        return ["var", name, "= defined." + name, "= this.addDefined('" + name + "',", definedToJs(defined.properties) + ");"].join(" ");
    }).value().join("\n"));
    ret.push(extd(flowObj.scope || []).map(function (s) {
        var name = s.name;
        scope[name] = {};
        return ["var", name, "= scope." + name, "= ", s.body, ";"].join(" ");
    }).value().join("\n"));
    ret.push("scope.console = console;\n");


    ret.push(extd(flowObj.rules || []).map(function (rule) {
        var identifiers = [], ret = ["this.rule('", rule.name.replace(/'/g, "\\'"), "'"], options = extd.merge(rule.options || {}, {scope: "scope"});
        ret.push(",", extd.format("%j", [options]).replace(/(:"scope")/, ":scope"));
        if (rule.constraints && !extd.isEmpty(rule.constraints)) {
            ret.push(", [");
            ret.push(extd(rule.constraints).map(function (c) {
                return constraintsToJs(c, identifiers);
            }).value().join(","));
            ret.push("]");
        }
        ret.push(",", actionToJs(rule.action, identifiers, defined, scope));
        ret.push(");");
        return ret.join("");
    }).value().join(""));
    ret.push("});");
    ret.push("};");
    ret.push("}());");
    return ret.join("");
};



},{"../constraintMatcher":9,"../extended":12,"../parser":44,"./common":4,"__browserify_Buffer":63}],7:[function(require,module,exports){
var map = require("./extended").map;

function salience(a, b) {
    return a.rule.priority - b.rule.priority;
}

function bucketCounter(a, b) {
    return a.counter - b.counter;
}

function factRecency(a, b) {
    /*jshint noempty: false*/

    var i = 0;
    var aMatchRecency = a.match.recency,
        bMatchRecency = b.match.recency, aLength = aMatchRecency.length - 1, bLength = bMatchRecency.length - 1;
    while (aMatchRecency[i] === bMatchRecency[i] && i < aLength && i < bLength && i++) {
    }
    var ret = aMatchRecency[i] - bMatchRecency[i];
    if (!ret) {
        ret = aLength - bLength;
    }
    return ret;
}

function activationRecency(a, b) {
    return a.recency - b.recency;
}

var strategies = {
    salience: salience,
    bucketCounter: bucketCounter,
    factRecency: factRecency,
    activationRecency: activationRecency
};

exports.strategies = strategies;
exports.strategy = function (strats) {
    strats = map(strats, function (s) {
        return strategies[s];
    });
    var stratsLength = strats.length;

    return function (a, b) {
        var i = -1, ret = 0;
        var equal = (a === b) || (a.name === b.name && a.hashCode === b.hashCode);
        if (!equal) {
            while (++i < stratsLength && !ret) {
                ret = strats[i](a, b);
            }
            ret = ret > 0 ? 1 : -1;
        }
        return ret;
    };
};
},{"./extended":12}],8:[function(require,module,exports){
"use strict";

var extd = require("./extended"),
    deepEqual = extd.deepEqual,
    merge = extd.merge,
    instanceOf = extd.instanceOf,
    filter = extd.filter,
    declare = extd.declare,
    constraintMatcher;

var id = 0;
var Constraint = declare({

    type: null,

    instance: {
        constructor: function (constraint) {
            if (!constraintMatcher) {
                constraintMatcher = require("./constraintMatcher");
            }
            this.id = id++;
            this.constraint = constraint;
            extd.bindAll(this, ["assert"]);
        },
        "assert": function () {
            throw new Error("not implemented");
        },

        getIndexableProperties: function () {
            return [];
        },

        equal: function (constraint) {
            return instanceOf(constraint, this._static) && this.get("alias") === constraint.get("alias") && extd.deepEqual(this.constraint, constraint.constraint);
        },

        getters: {
            variables: function () {
                return [this.get("alias")];
            }
        }


    }
});

Constraint.extend({
    instance: {

        type: "object",

        constructor: function (type) {
            this._super([type]);
        },

        "assert": function (param) {
            return param instanceof this.constraint || param.constructor === this.constraint;
        },

        equal: function (constraint) {
            return instanceOf(constraint, this._static) && this.constraint === constraint.constraint;
        }
    }
}).as(exports, "ObjectConstraint");

var EqualityConstraint = Constraint.extend({

    instance: {

        type: "equality",

        constructor: function (constraint, options) {
            this._super([constraint]);
            options = options || {};
            this.pattern = options.pattern;
            this._matcher = constraintMatcher.getMatcher(constraint, options, true);
        },

        "assert": function (values) {
            return this._matcher(values);
        }
    }
}).as(exports, "EqualityConstraint");

EqualityConstraint.extend({instance: {type: "inequality"}}).as(exports, "InequalityConstraint");
EqualityConstraint.extend({instance: {type: "comparison"}}).as(exports, "ComparisonConstraint");

Constraint.extend({

    instance: {

        type: "equality",

        constructor: function () {
            this._super([
                [true]
            ]);
        },

        equal: function (constraint) {
            return instanceOf(constraint, this._static) && this.get("alias") === constraint.get("alias");
        },


        "assert": function () {
            return true;
        }
    }
}).as(exports, "TrueConstraint");

var ReferenceConstraint = Constraint.extend({

    instance: {

        type: "reference",

        constructor: function (constraint, options) {
            this.cache = {};
            this._super([constraint]);
            options = options || {};
            this.values = [];
            this.pattern = options.pattern;
            this._options = options;
            this._matcher = constraintMatcher.getMatcher(constraint, options, false);
        },

        "assert": function (fact, fh) {
            try {
                return this._matcher(fact, fh);
            } catch (e) {
                throw new Error("Error with evaluating pattern " + this.pattern + " " + e.message);
            }

        },

        merge: function (that) {
            var ret = this;
            if (that instanceof ReferenceConstraint) {
                ret = new this._static([this.constraint, that.constraint, "and"], merge({}, this._options, this._options));
                ret._alias = this._alias || that._alias;
                ret.vars = this.vars.concat(that.vars);
            }
            return ret;
        },

        equal: function (constraint) {
            return instanceOf(constraint, this._static) && extd.deepEqual(this.constraint, constraint.constraint);
        },


        getters: {
            variables: function () {
                return this.vars;
            },

            alias: function () {
                return this._alias;
            }
        },

        setters: {
            alias: function (alias) {
                this._alias = alias;
                this.vars = filter(constraintMatcher.getIdentifiers(this.constraint), function (v) {
                    return v !== alias;
                });
            }
        }
    }

}).as(exports, "ReferenceConstraint");


ReferenceConstraint.extend({
    instance: {
        type: "reference_equality",
        op: "eq",
        getIndexableProperties: function () {
            return constraintMatcher.getIndexableProperties(this.constraint);
        }
    }
}).as(exports, "ReferenceEqualityConstraint")
    .extend({instance: {type: "reference_inequality", op: "neq"}}).as(exports, "ReferenceInequalityConstraint")
    .extend({instance: {type: "reference_gt", op: "gt"}}).as(exports, "ReferenceGTConstraint")
    .extend({instance: {type: "reference_gte", op: "gte"}}).as(exports, "ReferenceGTEConstraint")
    .extend({instance: {type: "reference_lt", op: "lt"}}).as(exports, "ReferenceLTConstraint")
    .extend({instance: {type: "reference_lte", op: "lte"}}).as(exports, "ReferenceLTEConstraint");


Constraint.extend({
    instance: {

        type: "hash",

        constructor: function (hash) {
            this._super([hash]);
        },

        equal: function (constraint) {
            return extd.instanceOf(constraint, this._static) && this.get("alias") === constraint.get("alias") && extd.deepEqual(this.constraint, constraint.constraint);
        },

        "assert": function () {
            return true;
        },

        getters: {
            variables: function () {
                return this.constraint;
            }
        }

    }
}).as(exports, "HashConstraint");

Constraint.extend({
    instance: {
        constructor: function (constraints, options) {
            this.type = "from";
            this.constraints = constraintMatcher.getSourceMatcher(constraints, (options || {}), true);
            extd.bindAll(this, ["assert"]);
        },

        equal: function (constraint) {
            return instanceOf(constraint, this._static) && this.get("alias") === constraint.get("alias") && deepEqual(this.constraints, constraint.constraints);
        },

        "assert": function (fact, fh) {
            return this.constraints(fact, fh);
        },

        getters: {
            variables: function () {
                return this.constraint;
            }
        }

    }
}).as(exports, "FromConstraint");

Constraint.extend({
    instance: {
        constructor: function (func, options) {
            this.type = "custom";
            this.fn = func;
            this.options = options;
            extd.bindAll(this, ["assert"]);
        },

        equal: function (constraint) {
            return instanceOf(constraint, this._static) && this.fn === constraint.constraint;
        },

        "assert": function (fact, fh) {
            return this.fn(fact, fh);
        }
    }
}).as(exports, "CustomConstraint");



},{"./constraintMatcher":9,"./extended":12}],9:[function(require,module,exports){
"use strict";

var extd = require("./extended"),
    isArray = extd.isArray,
    forEach = extd.forEach,
    some = extd.some,
    indexOf = extd.indexOf,
    isNumber = extd.isNumber,
    removeDups = extd.removeDuplicates,
    atoms = require("./constraint");

function getProps(val) {
    return extd(val).map(function mapper(val) {
        return isArray(val) ? isArray(val[0]) ? getProps(val).value() : val.reverse().join(".") : val;
    }).flatten().filter(function (v) {
        return !!v;
    });
}

var definedFuncs = {
    indexOf: extd.indexOf,
    now: function () {
        return new Date();
    },

    Date: function (y, m, d, h, min, s, ms) {
        var date = new Date();
        if (isNumber(y)) {
            date.setYear(y);
        }
        if (isNumber(m)) {
            date.setMonth(m);
        }
        if (isNumber(d)) {
            date.setDate(d);
        }
        if (isNumber(h)) {
            date.setHours(h);
        }
        if (isNumber(min)) {
            date.setMinutes(min);
        }
        if (isNumber(s)) {
            date.setSeconds(s);
        }
        if (isNumber(ms)) {
            date.setMilliseconds(ms);
        }
        return date;
    },

    lengthOf: function (arr, length) {
        return arr.length === length;
    },

    isTrue: function (val) {
        return val === true;
    },

    isFalse: function (val) {
        return val === false;
    },

    isNotNull: function (actual) {
        return actual !== null;
    },

    dateCmp: function (dt1, dt2) {
        return extd.compare(dt1, dt2);
    }

};

forEach(["years", "days", "months", "hours", "minutes", "seconds"], function (k) {
    definedFuncs[k + "FromNow"] = extd[k + "FromNow"];
    definedFuncs[k + "Ago"] = extd[k + "Ago"];
});


forEach(["isArray", "isNumber", "isHash", "isObject", "isDate", "isBoolean", "isString", "isRegExp", "isNull", "isEmpty",
    "isUndefined", "isDefined", "isUndefinedOrNull", "isPromiseLike", "isFunction", "deepEqual"], function (k) {
    var m = extd[k];
    definedFuncs[k] = function () {
        return m.apply(extd, arguments);
    };
});


var lang = {

    equal: function (c1, c2) {
        var ret = false;
        if (c1 === c2) {
            ret = true;
        } else {
            if (c1[2] === c2[2]) {
                if (indexOf(["string", "number", "boolean", "regexp", "identifier", "null"], c1[2]) !== -1) {
                    ret = c1[0] === c2[0];
                } else if (c1[2] === "unary" || c1[2] === "logicalNot") {
                    ret = this.equal(c1[0], c2[0]);
                } else {
                    ret = this.equal(c1[0], c2[0]) && this.equal(c1[1], c2[1]);
                }
            }
        }
        return ret;
    },

    __getProperties: function (rule) {
        var ret = [];
        if (rule) {
            var rule2 = rule[2];
            if (!rule2) {
                return ret;
            }
            if (rule2 !== "prop" &&
                rule2 !== "identifier" &&
                rule2 !== "string" &&
                rule2 !== "number" &&
                rule2 !== "boolean" &&
                rule2 !== "regexp" &&
                rule2 !== "unary" &&
                rule2 !== "unary") {
                ret[0] = this.__getProperties(rule[0]);
                ret[1] = this.__getProperties(rule[1]);
            } else if (rule2 === "identifier") {
                //at the bottom
                ret = [rule[0]];
            } else {
                ret = lang.__getProperties(rule[1]).concat(lang.__getProperties(rule[0]));
            }
        }
        return ret;
    },

    getIndexableProperties: function (rule) {
        if (rule[2] === "composite") {
            return this.getIndexableProperties(rule[0]);
        } else if (/^(\w+(\['[^']*'])*) *([!=]==?|[<>]=?) (\w+(\['[^']*'])*)$/.test(this.parse(rule))) {
            return getProps(this.__getProperties(rule)).flatten().value();
        } else {
            return [];
        }
    },

    getIdentifiers: function (rule) {
        var ret = [];
        var rule2 = rule[2];

        if (rule2 === "identifier") {
            //its an identifier so stop
            return [rule[0]];
        } else if (rule2 === "function") {
            ret = ret.concat(this.getIdentifiers(rule[0])).concat(this.getIdentifiers(rule[1]));
        } else if (rule2 !== "string" &&
            rule2 !== "number" &&
            rule2 !== "boolean" &&
            rule2 !== "regexp" &&
            rule2 !== "unary" &&
            rule2 !== "unary") {
            //its an expression so keep going
            if (rule2 === "prop") {
                ret = ret.concat(this.getIdentifiers(rule[0]));
                if (rule[1]) {
                    var propChain = rule[1];
                    //go through the member variables and collect any identifiers that may be in functions
                    while (isArray(propChain)) {
                        if (propChain[2] === "function") {
                            ret = ret.concat(this.getIdentifiers(propChain[1]));
                            break;
                        } else {
                            propChain = propChain[1];
                        }
                    }
                }

            } else {
                if (rule[0]) {
                    ret = ret.concat(this.getIdentifiers(rule[0]));
                }
                if (rule[1]) {
                    ret = ret.concat(this.getIdentifiers(rule[1]));
                }
            }
        }
        //remove dups and return
        return removeDups(ret);
    },

    toConstraints: function (rule, options) {
        var ret = [],
            alias = options.alias,
            scope = options.scope || {};

        var rule2 = rule[2];


        if (rule2 === "and") {
            ret = ret.concat(this.toConstraints(rule[0], options)).concat(this.toConstraints(rule[1], options));
        } else if (
            rule2 === "composite" ||
            rule2 === "or" ||
            rule2 === "lt" ||
            rule2 === "gt" ||
            rule2 === "lte" ||
            rule2 === "gte" ||
            rule2 === "like" ||
            rule2 === "notLike" ||
            rule2 === "eq" ||
            rule2 === "neq" ||
            rule2 === "seq" ||
            rule2 === "sneq" ||
            rule2 === "in" ||
            rule2 === "notIn" ||
            rule2 === "prop" ||
            rule2 === "propLookup" ||
            rule2 === "function" ||
            rule2 === "logicalNot") {
            var isReference = some(this.getIdentifiers(rule), function (i) {
                return i !== alias && !(i in definedFuncs) && !(i in scope);
            });
            switch (rule2) {
            case "eq":
                ret.push(new atoms[isReference ? "ReferenceEqualityConstraint" : "EqualityConstraint"](rule, options));
                break;
            case "seq":
                ret.push(new atoms[isReference ? "ReferenceEqualityConstraint" : "EqualityConstraint"](rule, options));
                break;
            case "neq":
                ret.push(new atoms[isReference ? "ReferenceInequalityConstraint" : "InequalityConstraint"](rule, options));
                break;
            case "sneq":
                ret.push(new atoms[isReference ? "ReferenceInequalityConstraint" : "InequalityConstraint"](rule, options));
                break;
            case "gt":
                ret.push(new atoms[isReference ? "ReferenceGTConstraint" : "ComparisonConstraint"](rule, options));
                break;
            case "gte":
                ret.push(new atoms[isReference ? "ReferenceGTEConstraint" : "ComparisonConstraint"](rule, options));
                break;
            case "lt":
                ret.push(new atoms[isReference ? "ReferenceLTConstraint" : "ComparisonConstraint"](rule, options));
                break;
            case "lte":
                ret.push(new atoms[isReference ? "ReferenceLTEConstraint" : "ComparisonConstraint"](rule, options));
                break;
            default:
                ret.push(new atoms[isReference ? "ReferenceConstraint" : "ComparisonConstraint"](rule, options));
            }

        }
        return ret;
    },


    parse: function (rule) {
        return this[rule[2]](rule[0], rule[1]);
    },

    composite: function (lhs) {
        return this.parse(lhs);
    },

    and: function (lhs, rhs) {
        return ["(", this.parse(lhs), "&&", this.parse(rhs), ")"].join(" ");
    },

    or: function (lhs, rhs) {
        return ["(", this.parse(lhs), "||", this.parse(rhs), ")"].join(" ");
    },

    prop: function (name, prop) {
        if (prop[2] === "function") {
            return [this.parse(name), this.parse(prop)].join(".");
        } else {
            return [this.parse(name), "['", this.parse(prop), "']"].join("");
        }
    },

    propLookup: function (name, prop) {
        if (prop[2] === "function") {
            return [this.parse(name), this.parse(prop)].join(".");
        } else {
            return [this.parse(name), "[", this.parse(prop), "]"].join("");
        }
    },

    unary: function (lhs) {
        return -1 * this.parse(lhs);
    },

    plus: function (lhs, rhs) {
        return [this.parse(lhs), "+", this.parse(rhs)].join(" ");
    },
    minus: function (lhs, rhs) {
        return [this.parse(lhs), "-", this.parse(rhs)].join(" ");
    },

    mult: function (lhs, rhs) {
        return [this.parse(lhs), "*", this.parse(rhs)].join(" ");
    },

    div: function (lhs, rhs) {
        return [this.parse(lhs), "/", this.parse(rhs)].join(" ");
    },

    mod: function (lhs, rhs) {
        return [this.parse(lhs), "%", this.parse(rhs)].join(" ");
    },

    lt: function (lhs, rhs) {
        return [this.parse(lhs), "<", this.parse(rhs)].join(" ");
    },
    gt: function (lhs, rhs) {
        return [this.parse(lhs), ">", this.parse(rhs)].join(" ");
    },
    lte: function (lhs, rhs) {
        return [this.parse(lhs), "<=", this.parse(rhs)].join(" ");
    },
    gte: function (lhs, rhs) {
        return [this.parse(lhs), ">=", this.parse(rhs)].join(" ");
    },
    like: function (lhs, rhs) {
        return [this.parse(rhs), ".test(", this.parse(lhs), ")"].join("");
    },
    notLike: function (lhs, rhs) {
        return ["!", this.parse(rhs), ".test(", this.parse(lhs), ")"].join("");
    },
    eq: function (lhs, rhs) {
        return [this.parse(lhs), "==", this.parse(rhs)].join(" ");
    },

    seq: function (lhs, rhs) {
        return [this.parse(lhs), "===", this.parse(rhs)].join(" ");
    },

    neq: function (lhs, rhs) {
        return [this.parse(lhs), "!=", this.parse(rhs)].join(" ");
    },

    sneq: function (lhs, rhs) {
        return [this.parse(lhs), "!==", this.parse(rhs)].join(" ");
    },

    "in": function (lhs, rhs) {
        return ["(indexOf(", this.parse(rhs), ",", this.parse(lhs), ")) != -1"].join("");
    },

    "notIn": function (lhs, rhs) {
        return ["(indexOf(", this.parse(rhs), ",", this.parse(lhs), ")) == -1"].join("");
    },

    "arguments": function (lhs, rhs) {
        var ret = [];
        if (lhs) {
            ret.push(this.parse(lhs));
        }
        if (rhs) {
            ret.push(this.parse(rhs));
        }
        return ret.join(",");
    },

    "array": function (lhs) {
        var args = [];
        if (lhs) {
            args = this.parse(lhs);
            if (isArray(args)) {
                return args;
            } else {
                return ["[", args, "]"].join("");
            }
        }
        return ["[", args.join(","), "]"].join("");
    },

    "function": function (lhs, rhs) {
        var args = this.parse(rhs);
        return [this.parse(lhs), "(", args, ")"].join("");
    },

    "string": function (lhs) {
        return "'" + lhs + "'";
    },

    "number": function (lhs) {
        return lhs;
    },

    "boolean": function (lhs) {
        return lhs;
    },

    regexp: function (lhs) {
        return lhs;
    },

    identifier: function (lhs) {
        return lhs;
    },

    "null": function () {
        return "null";
    },

    logicalNot: function (lhs) {
        return ["!(", this.parse(lhs), ")"].join("");
    }
};

var matcherCount = 0;
var toJs = exports.toJs = function (rule, scope, alias, equality, wrap) {
    /*jshint evil:true*/
    var js = lang.parse(rule);
    scope = scope || {};
    var vars = lang.getIdentifiers(rule);
    var closureVars = ["var indexOf = definedFuncs.indexOf; var hasOwnProperty = Object.prototype.hasOwnProperty;"], funcVars = [];
    extd(vars).filter(function (v) {
        var ret = ["var ", v, " = "];
        if (definedFuncs.hasOwnProperty(v)) {
            ret.push("definedFuncs['", v, "']");
        } else if (scope.hasOwnProperty(v)) {
            ret.push("scope['", v, "']");
        } else {
            return true;
        }
        ret.push(";");
        closureVars.push(ret.join(""));
        return false;
    }).forEach(function (v) {
        var ret = ["var ", v, " = "];
        if (equality || v !== alias) {
            ret.push("fact." + v);
        } else if (v === alias) {
            ret.push("hash.", v, "");
        }
        ret.push(";");
        funcVars.push(ret.join(""));
    });
    var closureBody = closureVars.join("") + "return function matcher" + (matcherCount++) + (!equality ? "(fact, hash){" : "(fact){") + funcVars.join("") + " return " + (wrap ? wrap(js) : js) + ";}";
    var f = new Function("definedFuncs, scope", closureBody)(definedFuncs, scope);
    //console.log(f.toString());
    return f;
};

exports.getMatcher = function (rule, options, equality) {
    options = options || {};
    return toJs(rule, options.scope, options.alias, equality, function (src) {
        return "!!(" + src + ")";
    });
};

exports.getSourceMatcher = function (rule, options, equality) {
    options = options || {};
    return toJs(rule, options.scope, options.alias, equality, function (src) {
        return src;
    });
};

exports.toConstraints = function (constraint, options) {
    if (typeof constraint === 'function') {
        return [new atoms.CustomConstraint(constraint, options)];
    }
    //constraint.split("&&")
    return lang.toConstraints(constraint, options);
};

exports.equal = function (c1, c2) {
    return lang.equal(c1, c2);
};

exports.getIdentifiers = function (constraint) {
    return lang.getIdentifiers(constraint);
};

exports.getIndexableProperties = function (constraint) {
    return lang.getIndexableProperties(constraint);
};
},{"./constraint":8,"./extended":12}],10:[function(require,module,exports){
"use strict";
var extd = require("./extended"),
    isBoolean = extd.isBoolean,
    declare = extd.declare,
    indexOf = extd.indexOf,
    pPush = Array.prototype.push;

function createContextHash(paths, hashCode) {
    var ret = "",
        i = -1,
        l = paths.length;
    while (++i < l) {
        ret += paths[i].id + ":";
    }
    ret += hashCode;
    return ret;
}

function merge(h1, h2, aliases) {
    var i = -1, l = aliases.length, alias;
    while (++i < l) {
        alias = aliases[i];
        h1[alias] = h2[alias];
    }
}

function unionRecency(arr, arr1, arr2) {
    pPush.apply(arr, arr1);
    var i = -1, l = arr2.length, val, j = arr.length;
    while (++i < l) {
        val = arr2[i];
        if (indexOf(arr, val) === -1) {
            arr[j++] = val;
        }
    }
}

var Match = declare({
    instance: {

        isMatch: true,
        hashCode: "",
        facts: null,
        factIds: null,
        factHash: null,
        recency: null,
        aliases: null,

        constructor: function () {
            this.facts = [];
            this.factIds = [];
            this.factHash = {};
            this.recency = [];
            this.aliases = [];
        },

        addFact: function (assertable) {
            pPush.call(this.facts, assertable);
            pPush.call(this.recency, assertable.recency);
            pPush.call(this.factIds, assertable.id);
            this.hashCode = this.factIds.join(":");
            return this;
        },

        merge: function (mr) {
            var ret = new Match();
            ret.isMatch = mr.isMatch;
            pPush.apply(ret.facts, this.facts);
            pPush.apply(ret.facts, mr.facts);
            pPush.apply(ret.aliases, this.aliases);
            pPush.apply(ret.aliases, mr.aliases);
            ret.hashCode = this.hashCode + ":" + mr.hashCode;
            merge(ret.factHash, this.factHash, this.aliases);
            merge(ret.factHash, mr.factHash, mr.aliases);
            unionRecency(ret.recency, this.recency, mr.recency);
            return ret;
        }
    }
});

var Context = declare({
    instance: {
        match: null,
        factHash: null,
        aliases: null,
        fact: null,
        hashCode: null,
        paths: null,
        pathsHash: null,

        constructor: function (fact, paths, mr) {
            this.fact = fact;
            if (mr) {
                this.match = mr;
            } else {
                this.match = new Match().addFact(fact);
            }
            this.factHash = this.match.factHash;
            this.aliases = this.match.aliases;
            this.hashCode = this.match.hashCode;
            if (paths) {
                this.paths = paths;
                this.pathsHash = createContextHash(paths, this.hashCode);
            } else {
                this.pathsHash = this.hashCode;
            }
        },

        "set": function (key, value) {
            this.factHash[key] = value;
            this.aliases.push(key);
            return this;
        },

        isMatch: function (isMatch) {
            if (isBoolean(isMatch)) {
                this.match.isMatch = isMatch;
            } else {
                return this.match.isMatch;
            }
            return this;
        },

        mergeMatch: function (merge) {
            var match = this.match = this.match.merge(merge);
            this.factHash = match.factHash;
            this.hashCode = match.hashCode;
            this.aliases = match.aliases;
            return this;
        },

        clone: function (fact, paths, match) {
            return new Context(fact || this.fact, paths || this.path, match || this.match);
        }
    }
}).as(module);



},{"./extended":12}],11:[function(require,module,exports){
var extd = require("./extended"),
    Promise = extd.Promise,
    nextTick = require("./nextTick"),
    isPromiseLike = extd.isPromiseLike;

Promise.extend({
    instance: {

        looping: false,

        constructor: function (flow, matchUntilHalt) {
            this._super([]);
            this.flow = flow;
            this.agenda = flow.agenda;
            this.rootNode = flow.rootNode;
            this.matchUntilHalt = !!(matchUntilHalt);
            extd.bindAll(this, ["onAlter", "callNext"]);
        },

        halt: function () {
            this.__halted = true;
            if (!this.looping) {
                this.callback();
            }
        },

        onAlter: function () {
            this.flowAltered = true;
            if (!this.looping && this.matchUntilHalt && !this.__halted) {
                this.callNext();
            }
        },

        setup: function () {
            var flow = this.flow;
            this.rootNode.resetCounter();
            flow.on("assert", this.onAlter);
            flow.on("modify", this.onAlter);
            flow.on("retract", this.onAlter);
        },

        tearDown: function () {
            var flow = this.flow;
            flow.removeListener("assert", this.onAlter);
            flow.removeListener("modify", this.onAlter);
            flow.removeListener("retract", this.onAlter);
        },

        __handleAsyncNext: function (next) {
            var self = this, agenda = self.agenda;
            return next.then(function () {
                self.looping = false;
                if (!agenda.isEmpty()) {
                    if (self.flowAltered) {
                        self.rootNode.incrementCounter();
                        self.flowAltered = false;
                    }
                    if (!self.__halted) {
                        self.callNext();
                    } else {
                        self.callback();
                    }
                } else if (!self.matchUntilHalt || self.__halted) {
                    self.callback();
                }
                self = null;
            }, this.errback);
        },

        __handleSyncNext: function (next) {
            this.looping = false;
            if (!this.agenda.isEmpty()) {
                if (this.flowAltered) {
                    this.rootNode.incrementCounter();
                    this.flowAltered = false;
                }
            }
            if (next && !this.__halted) {
                nextTick(this.callNext);
            } else if (!this.matchUntilHalt || this.__halted) {
                this.callback();
            }
            return next;
        },

        callback: function () {
            this.tearDown();
            this._super(arguments);
        },


        callNext: function () {
            this.looping = true;
            var next = this.agenda.fireNext();
            return isPromiseLike(next) ? this.__handleAsyncNext(next) : this.__handleSyncNext(next);
        },

        execute: function () {
            this.setup();
            this.callNext();
            return this;
        }
    }
}).as(module);
},{"./extended":12,"./nextTick":17}],12:[function(require,module,exports){
var arr = require("array-extended"),
    unique = arr.unique,
    indexOf = arr.indexOf,
    map = arr.map,
    pSlice = Array.prototype.slice,
    pSplice = Array.prototype.splice;

function plucked(prop) {
    var exec = prop.match(/(\w+)\(\)$/);
    if (exec) {
        prop = exec[1];
        return function (item) {
            return item[prop]();
        };
    } else {
        return function (item) {
            return item[prop];
        };
    }
}

function plucker(prop) {
    prop = prop.split(".");
    if (prop.length === 1) {
        return plucked(prop[0]);
    } else {
        var pluckers = map(prop, function (prop) {
            return plucked(prop);
        });
        var l = pluckers.length;
        return function (item) {
            var i = -1, res = item;
            while (++i < l) {
                res = pluckers[i](res);
            }
            return res;
        };
    }
}

function intersection(a, b) {
    a = pSlice.call(a);
    var aOne, i = -1, l;
    l = a.length;
    while (++i < l) {
        aOne = a[i];
        if (indexOf(b, aOne) === -1) {
            pSplice.call(a, i--, 1);
            l--;
        }
    }
    return a;
}

function inPlaceIntersection(a, b) {
    var aOne, i = -1, l;
    l = a.length;
    while (++i < l) {
        aOne = a[i];
        if (indexOf(b, aOne) === -1) {
            pSplice.call(a, i--, 1);
            l--;
        }
    }
    return a;
}

function inPlaceDifference(a, b) {
    var aOne, i = -1, l;
    l = a.length;
    while (++i < l) {
        aOne = a[i];
        if (indexOf(b, aOne) !== -1) {
            pSplice.call(a, i--, 1);
            l--;
        }
    }
    return a;
}

function diffArr(arr1, arr2) {
    var ret = [], i = -1, j, l2 = arr2.length, l1 = arr1.length, a, found;
    if (l2 > l1) {
        ret = arr1.slice();
        while (++i < l2) {
            a = arr2[i];
            j = -1;
            l1 = ret.length;
            while (++j < l1) {
                if (ret[j] === a) {
                    ret.splice(j, 1);
                    break;
                }
            }
        }
    } else {
        while (++i < l1) {
            a = arr1[i];
            j = -1;
            found = false;
            while (++j < l2) {
                if (arr2[j] === a) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                ret.push(a);
            }
        }
    }
    return ret;
}

function diffHash(h1, h2) {
    var ret = {};
    for (var i in h1) {
        if (!hasOwnProperty.call(h2, i)) {
            ret[i] = h1[i];
        }
    }
    return ret;
}


function union(arr1, arr2) {
    return unique(arr1.concat(arr2));
}

module.exports = require("extended")()
    .register(require("date-extended"))
    .register(arr)
    .register(require("object-extended"))
    .register(require("string-extended"))
    .register(require("promise-extended"))
    .register(require("function-extended"))
    .register(require("is-extended"))
    .register("intersection", intersection)
    .register("inPlaceIntersection", inPlaceIntersection)
    .register("inPlaceDifference", inPlaceDifference)
    .register("diffArr", diffArr)
    .register("diffHash", diffHash)
    .register("unionArr", union)
    .register("plucker", plucker)
    .register("HashTable", require("ht"))
    .register("declare", require("declare.js"))
    .register(require("leafy"))
    .register("LinkedList", require("./linkedList"));


},{"./linkedList":16,"array-extended":52,"date-extended":53,"declare.js":55,"extended":56,"function-extended":59,"ht":65,"is-extended":66,"leafy":67,"object-extended":68,"promise-extended":69,"string-extended":70}],13:[function(require,module,exports){
"use strict";
var extd = require("./extended"),
    bind = extd.bind,
    declare = extd.declare,
    nodes = require("./nodes"),
    EventEmitter = require("events").EventEmitter,
    wm = require("./workingMemory"),
    WorkingMemory = wm.WorkingMemory,
    ExecutionStragegy = require("./executionStrategy"),
    AgendaTree = require("./agenda");

module.exports = declare(EventEmitter, {

    instance: {

        name: null,

        executionStrategy: null,

        constructor: function (name, conflictResolutionStrategy) {
            this.env = null;
            this.name = name;
            this.__rules = {};
            this.conflictResolutionStrategy = conflictResolutionStrategy;
            this.workingMemory = new WorkingMemory();
            this.agenda = new AgendaTree(this, conflictResolutionStrategy);
            this.agenda.on("fire", bind(this, "emit", "fire"));
            this.agenda.on("focused", bind(this, "emit", "focused"));
            this.rootNode = new nodes.RootNode(this.workingMemory, this.agenda);
            extd.bindAll(this, "halt", "assert", "retract", "modify", "focus",
              "emit", "getFacts", "getFact");
        },

        getFacts: function (Type) {
            var ret;
            if (Type) {
                ret = this.workingMemory.getFactsByType(Type);
            } else {
                ret = this.workingMemory.getFacts();
            }
            return ret;
        },

        getFact: function (Type) {
            var ret;
            if (Type) {
                ret = this.workingMemory.getFactsByType(Type);
            } else {
                ret = this.workingMemory.getFacts();
            }
            return ret && ret[0];
        },

        focus: function (focused) {
            this.agenda.setFocus(focused);
            return this;
        },

        halt: function () {
            this.executionStrategy.halt();
            return this;
        },

        dispose: function () {
            this.workingMemory.dispose();
            this.agenda.dispose();
            this.rootNode.dispose();
        },

        assert: function (fact) {
            this.rootNode.assertFact(this.workingMemory.assertFact(fact));
            this.emit("assert", fact);
            return fact;
        },

        // This method is called to remove an existing fact from working memory
        retract: function (fact) {
            //fact = this.workingMemory.getFact(fact);
            this.rootNode.retractFact(this.workingMemory.retractFact(fact));
            this.emit("retract", fact);
            return fact;
        },

        // This method is called to alter an existing fact.  It is essentially a
        // retract followed by an assert.
        modify: function (fact, cb) {
            //fact = this.workingMemory.getFact(fact);
            if ("function" === typeof cb) {
                cb.call(fact, fact);
            }
            this.rootNode.modifyFact(this.workingMemory.modifyFact(fact));
            this.emit("modify", fact);
            return fact;
        },

        print: function () {
            this.rootNode.print();
        },

        containsRule: function (name) {
            return this.rootNode.containsRule(name);
        },

        rule: function (rule) {
            this.rootNode.assertRule(rule);
        },

        matchUntilHalt: function (cb) {
            return (this.executionStrategy = new ExecutionStragegy(this, true)).execute().classic(cb).promise();
        },

        match: function (cb) {
            return (this.executionStrategy = new ExecutionStragegy(this)).execute().classic(cb).promise();
        }

    }
});
},{"./agenda":3,"./executionStrategy":11,"./extended":12,"./nodes":27,"./workingMemory":50,"events":60}],14:[function(require,module,exports){
"use strict";
var extd = require("./extended"),
    instanceOf = extd.instanceOf,
    forEach = extd.forEach,
    declare = extd.declare,
    InitialFact = require("./pattern").InitialFact,
    conflictStrategies = require("./conflict"),
    conflictResolution = conflictStrategies.strategy(["salience", "activationRecency"]),
    rule = require("./rule"),
    Flow = require("./flow");

var flows = {};
var FlowContainer = declare({

    instance: {

        constructor: function (name, cb) {
            this.name = name;
            this.cb = cb;
            this.__rules = [];
            this.__defined = {};
            this.conflictResolutionStrategy = conflictResolution;
            if (cb) {
                cb.call(this, this);
            }
            if (!flows.hasOwnProperty(name)) {
                flows[name] = this;
            } else {
                throw new Error("Flow with " + name + " already defined");
            }
        },

        conflictResolution: function (strategies) {
            this.conflictResolutionStrategy = conflictStrategies.strategy(strategies);
            return this;
        },

        getDefined: function (name) {
            var ret = this.__defined[name.toLowerCase()];
            if (!ret) {
                throw new Error(name + " flow class is not defined");
            }
            return ret;
        },

        addDefined: function (name, cls) {
            //normalize
            this.__defined[name.toLowerCase()] = cls;
            return cls;
        },

        rule: function () {
            this.__rules = this.__rules.concat(rule.createRule.apply(rule, arguments));
            return this;
        },

        getSession: function () {
            var flow = new Flow(this.name, this.conflictResolutionStrategy);
            forEach(this.__rules, function (rule) {
                flow.rule(rule);
            });
            flow.assert(new InitialFact());
            for (var i = 0, l = arguments.length; i < l; i++) {
                flow.assert(arguments[i]);
            }
            return flow;
        },

        containsRule: function (name) {
            return extd.some(this.__rules, function (rule) {
                return rule.name === name;
            });
        }

    },

    "static": {
        getFlow: function (name) {
            return flows[name];
        },

        hasFlow: function (name) {
            return extd.has(flows, name);
        },

        deleteFlow: function (name) {
            if (instanceOf(name, FlowContainer)) {
                name = name.name;
            }
            delete flows[name];
            return FlowContainer;
        },

        deleteFlows: function () {
            for (var name in flows) {
                if (name in flows) {
                    delete flows[name];
                }
            }
            return FlowContainer;
        },

        create: function (name, cb) {
            return new FlowContainer(name, cb);
        }
    }

}).as(module);
},{"./conflict":7,"./extended":12,"./flow":13,"./pattern":48,"./rule":49}],15:[function(require,module,exports){
/**
 *
 * @projectName nools
 * @github https://github.com/C2FO/nools
 * @includeDoc [Examples] ../docs-md/examples.md
 * @includeDoc [Change Log] ../History.md
 * @header [../readme.md]
 */

"use strict";
var extd = require("./extended"),
    fs = require("fs"),
    path = require("path"),
    compile = require("./compile"),
    FlowContainer = require("./flowContainer");

function isNoolsFile(file) {
    return (/\.nools$/).test(file);
}

function parse(source) {
    var ret;
    if (isNoolsFile(source)) {
        ret = compile.parse(fs.readFileSync(source, "utf8"), source);
    } else {
        ret = compile.parse(source);
    }
    return ret;
}

exports.Flow = FlowContainer;

exports.getFlow = FlowContainer.getFlow;
exports.hasFlow = FlowContainer.hasFlow;

exports.deleteFlow = function (name) {
    FlowContainer.deleteFlow(name);
    return this;
};

exports.deleteFlows = function () {
    FlowContainer.deleteFlows();
    return this;
};

exports.flow = FlowContainer.create;

exports.compile = function (file, options, cb) {
    if (extd.isFunction(options)) {
        cb = options;
        options = {};
    } else {
        options = options || {};
        cb = null;
    }
    if (extd.isString(file)) {
        options.name = options.name || (isNoolsFile(file) ? path.basename(file, path.extname(file)) : null);
        file = parse(file);
    }
    if (!options.name) {
        throw new Error("Name required when compiling nools source");
    }
    return  compile.compile(file, options, cb, FlowContainer);
};

exports.transpile = function (file, options) {
    options = options || {};
    if (extd.isString(file)) {
        options.name = options.name || (isNoolsFile(file) ? path.basename(file, path.extname(file)) : null);
        file = parse(file);
    }
    return compile.transpile(file, options);
};

exports.parse = parse;
},{"./compile":5,"./extended":12,"./flowContainer":14,"fs":61,"path":62}],16:[function(require,module,exports){
var declare = require("declare.js");
declare({

    instance: {
        constructor: function () {
            this.head = null;
            this.tail = null;
            this.length = null;
        },

        push: function (data) {
            var tail = this.tail, head = this.head, node = {data: data, prev: tail, next: null};
            if (tail) {
                this.tail.next = node;
            }
            this.tail = node;
            if (!head) {
                this.head = node;
            }
            this.length++;
            return node;
        },

        remove: function (node) {
            if (node.prev) {
                node.prev.next = node.next;
            } else {
                this.head = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            } else {
                this.tail = node.prev;
            }
            //node.data = node.prev = node.next = null;
            this.length--;
        },

        forEach: function (cb) {
            var head = {next: this.head};
            while ((head = head.next)) {
                cb(head.data);
            }
        },

        toArray: function () {
            var head = {next: this.head}, ret = [];
            while ((head = head.next)) {
                ret.push(head);
            }
            return ret;
        },

        removeByData: function (data) {
            var head = {next: this.head};
            while ((head = head.next)) {
                if (head.data === data) {
                    this.remove(head);
                    break;
                }
            }
        },

        getByData: function (data) {
            var head = {next: this.head};
            while ((head = head.next)) {
                if (head.data === data) {
                    return head;
                }
            }
        },

        clear: function () {
            this.head = this.tail = null;
            this.length = 0;
        }

    }

}).as(module);

},{"declare.js":55}],17:[function(require,module,exports){
var process=require("__browserify_process");/*global setImmediate, window, MessageChannel*/
var extd = require("./extended");
var nextTick;
if (typeof setImmediate === "function") {
    // In IE10, or use https://github.com/NobleJS/setImmediate
    if (typeof window !== "undefined") {
        nextTick = extd.bind(window, setImmediate);
    } else {
        nextTick = setImmediate;
    }
} else if (typeof process !== "undefined") {
    // node
    nextTick = process.nextTick;
} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    // linked list of tasks (single, with head node)
    var head = {}, tail = head;
    channel.port1.onmessage = function () {
        head = head.next;
        var task = head.task;
        delete head.task;
        task();
    };
    nextTick = function (task) {
        tail = tail.next = {task: task};
        channel.port2.postMessage(0);
    };
} else {
    // old browsers
    nextTick = function (task) {
        setTimeout(task, 0);
    };
}

module.exports = nextTick;
},{"./extended":12,"__browserify_process":64}],18:[function(require,module,exports){
var Node = require("./node"),
    intersection = require("../extended").intersection;

Node.extend({
    instance: {

        __propagatePaths: function (method, context) {
            var entrySet = this.__entrySet, i = entrySet.length, entry, outNode, paths, continuingPaths;
            while (--i > -1) {
                entry = entrySet[i];
                outNode = entry.key;
                paths = entry.value;
                if ((continuingPaths = intersection(paths, context.paths)).length) {
                    outNode[method](context.clone(null, continuingPaths, null));
                }
            }
        },

        __propagateNoPaths: function (method, context) {
            var entrySet = this.__entrySet, i = entrySet.length;
            while (--i > -1) {
                entrySet[i].key[method](context);
            }
        },

        __propagate: function (method, context) {
            if (context.paths) {
                this.__propagatePaths(method, context);
            } else {
                this.__propagateNoPaths(method, context);
            }
        }
    }
}).as(module);
},{"../extended":12,"./node":37}],19:[function(require,module,exports){
var AlphaNode = require("./alphaNode");

AlphaNode.extend({
    instance: {

        constructor: function () {
            this._super(arguments);
            this.alias = this.constraint.get("alias");
        },

        toString: function () {
            return "AliasNode" + this.__count;
        },

        assert: function (context) {
            return this.__propagate("assert", context.set(this.alias, context.fact.object));
        },

        modify: function (context) {
            return this.__propagate("modify", context.set(this.alias, context.fact.object));
        },

        retract: function (context) {
            return this.__propagate("retract", context.set(this.alias, context.fact.object));
        },

        equal: function (other) {
            return other instanceof this._static && this.alias === other.alias;
        }
    }
}).as(module);
},{"./alphaNode":20}],20:[function(require,module,exports){
"use strict";
var Node = require("./node");

Node.extend({
    instance: {
        constructor: function (constraint) {
            this._super([]);
            this.constraint = constraint;
            this.constraintAssert = this.constraint.assert;
        },

        toString: function () {
            return "AlphaNode " + this.__count;
        },

        equal: function (constraint) {
            return this.constraint.equal(constraint.constraint);
        }
    }
}).as(module);
},{"./node":37}],21:[function(require,module,exports){
var extd = require("../extended"),
    keys = extd.hash.keys,
    Node = require("./node"),
    LeftMemory = require("./misc/leftMemory"), RightMemory = require("./misc/rightMemory");

Node.extend({

    instance: {

        nodeType: "BetaNode",

        constructor: function () {
            this._super([]);
            this.leftMemory = {};
            this.rightMemory = {};
            this.leftTuples = new LeftMemory();
            this.rightTuples = new RightMemory();
        },

        __propagate: function (method, context) {
            var entrySet = this.__entrySet, i = entrySet.length, entry, outNode;
            while (--i > -1) {
                entry = entrySet[i];
                outNode = entry.key;
                outNode[method](context);
            }
        },

        dispose: function () {
            this.leftMemory = {};
            this.rightMemory = {};
            this.leftTuples.clear();
            this.rightTuples.clear();
        },

        disposeLeft: function (fact) {
            this.leftMemory = {};
            this.leftTuples.clear();
            this.propagateDispose(fact);
        },

        disposeRight: function (fact) {
            this.rightMemory = {};
            this.rightTuples.clear();
            this.propagateDispose(fact);
        },

        hashCode: function () {
            return  this.nodeType + " " + this.__count;
        },

        toString: function () {
            return this.nodeType + " " + this.__count;
        },

        retractLeft: function (context) {
            context = this.removeFromLeftMemory(context).data;
            var rightMatches = context.rightMatches,
                hashCodes = keys(rightMatches),
                i = -1,
                l = hashCodes.length;
            while (++i < l) {
                this.__propagate("retract", rightMatches[hashCodes[i]].clone());
            }
        },

        retractRight: function (context) {
            context = this.removeFromRightMemory(context).data;
            var leftMatches = context.leftMatches,
                hashCodes = keys(leftMatches),
                i = -1,
                l = hashCodes.length;
            while (++i < l) {
                this.__propagate("retract", leftMatches[hashCodes[i]].clone());
            }
        },

        assertLeft: function (context) {
            this.__addToLeftMemory(context);
            var rm = this.rightTuples.getRightMemory(context), i = -1, l = rm.length;
            while (++i < l) {
                this.propagateFromLeft(context, rm[i].data);
            }
        },

        assertRight: function (context) {
            this.__addToRightMemory(context);
            var lm = this.leftTuples.getLeftMemory(context), i = -1, l = lm.length;
            while (++i < l) {
                this.propagateFromRight(context, lm[i].data);
            }
        },

        modifyLeft: function (context) {
            var previousContext = this.removeFromLeftMemory(context).data;
            this.__addToLeftMemory(context);
            var rm = this.rightTuples.getRightMemory(context), l = rm.length, i = -1, rightMatches;
            if (!l) {
                this.propagateRetractModifyFromLeft(previousContext);
            } else {
                rightMatches = previousContext.rightMatches;
                while (++i < l) {
                    this.propagateAssertModifyFromLeft(context, rightMatches, rm[i].data);
                }

            }
        },

        modifyRight: function (context) {
            var previousContext = this.removeFromRightMemory(context).data;
            this.__addToRightMemory(context);
            var lm = this.leftTuples.getLeftMemory(context);
            if (!lm.length) {
                this.propagateRetractModifyFromRight(previousContext);
            } else {
                var leftMatches = previousContext.leftMatches, i = -1, l = lm.length;
                while (++i < l) {
                    this.propagateAssertModifyFromRight(context, leftMatches, lm[i].data);
                }
            }
        },

        propagateFromLeft: function (context, rc) {
            this.__propagate("assert", this.__addToMemoryMatches(rc, context, context.clone(null, null, context.match.merge(rc.match))));
        },

        propagateFromRight: function (context, lc) {
            this.__propagate("assert", this.__addToMemoryMatches(context, lc, lc.clone(null, null, lc.match.merge(context.match))));
        },

        propagateRetractModifyFromLeft: function (context) {
            var rightMatches = context.rightMatches,
                hashCodes = keys(rightMatches),
                l = hashCodes.length,
                i = -1;
            while (++i < l) {
                this.__propagate("retract", rightMatches[hashCodes[i]].clone());
            }
        },

        propagateRetractModifyFromRight: function (context) {
            var leftMatches = context.leftMatches,
                hashCodes = keys(leftMatches),
                l = hashCodes.length,
                i = -1;
            while (++i < l) {
                this.__propagate("retract", leftMatches[hashCodes[i]].clone());
            }
        },

        propagateAssertModifyFromLeft: function (context, rightMatches, rm) {
            var factId = rm.hashCode;
            if (factId in rightMatches) {
                this.__propagate("modify", this.__addToMemoryMatches(rm, context, context.clone(null, null, context.match.merge(rm.match))));
            } else {
                this.propagateFromLeft(context, rm);
            }
        },

        propagateAssertModifyFromRight: function (context, leftMatches, lm) {
            var factId = lm.hashCode;
            if (factId in leftMatches) {
                this.__propagate("modify", this.__addToMemoryMatches(context, lm, context.clone(null, null, lm.match.merge(context.match))));
            } else {
                this.propagateFromRight(context, lm);
            }
        },

        removeFromRightMemory: function (context) {
            var hashCode = context.hashCode, ret;
            context = this.rightMemory[hashCode] || null;
            var tuples = this.rightTuples;
            if (context) {
                var leftMemory = this.leftMemory;
                ret = context.data;
                var leftMatches = ret.leftMatches;
                tuples.remove(context);
                var hashCodes = keys(leftMatches), i = -1, l = hashCodes.length;
                while (++i < l) {
                    delete leftMemory[hashCodes[i]].data.rightMatches[hashCode];
                }
                delete this.rightMemory[hashCode];
            }
            return context;
        },

        removeFromLeftMemory: function (context) {
            var hashCode = context.hashCode;
            context = this.leftMemory[hashCode] || null;
            if (context) {
                var rightMemory = this.rightMemory;
                var rightMatches = context.data.rightMatches;
                this.leftTuples.remove(context);
                var hashCodes = keys(rightMatches), i = -1, l = hashCodes.length;
                while (++i < l) {
                    delete rightMemory[hashCodes[i]].data.leftMatches[hashCode];
                }
                delete this.leftMemory[hashCode];
            }
            return context;
        },

        getRightMemoryMatches: function (context) {
            var lm = this.leftMemory[context.hashCode], ret = {};
            if (lm) {
                ret = lm.rightMatches;
            }
            return ret;
        },

        __addToMemoryMatches: function (rightContext, leftContext, createdContext) {
            var rightFactId = rightContext.hashCode,
                rm = this.rightMemory[rightFactId],
                lm, leftFactId = leftContext.hashCode;
            if (rm) {
                rm = rm.data;
                if (leftFactId in rm.leftMatches) {
                    throw new Error("Duplicate left fact entry");
                }
                rm.leftMatches[leftFactId] = createdContext;
            }
            lm = this.leftMemory[leftFactId];
            if (lm) {
                lm = lm.data;
                if (rightFactId in lm.rightMatches) {
                    throw new Error("Duplicate right fact entry");
                }
                lm.rightMatches[rightFactId] = createdContext;
            }
            return createdContext;
        },

        __addToRightMemory: function (context) {
            var hashCode = context.hashCode, rm = this.rightMemory;
            if (hashCode in rm) {
                return false;
            }
            rm[hashCode] = this.rightTuples.push(context);
            context.leftMatches = {};
            return true;
        },


        __addToLeftMemory: function (context) {
            var hashCode = context.hashCode, lm = this.leftMemory;
            if (hashCode in lm) {
                return false;
            }
            lm[hashCode] = this.leftTuples.push(context);
            context.rightMatches = {};
            return true;
        }
    }

}).as(module);
},{"../extended":12,"./misc/leftMemory":32,"./misc/rightMemory":34,"./node":37}],22:[function(require,module,exports){
var AlphaNode = require("./alphaNode");

AlphaNode.extend({
    instance: {

        constructor: function () {
            this.memory = {};
            this._super(arguments);
            this.constraintAssert = this.constraint.assert;
        },

        assert: function (context) {
            if ((this.memory[context.pathsHash] = this.constraintAssert(context.factHash))) {
                this.__propagate("assert", context);
            }
        },

        modify: function (context) {
            var memory = this.memory,
                hashCode = context.pathsHash,
                wasMatch = memory[hashCode];
            if ((memory[hashCode] = this.constraintAssert(context.factHash))) {
                this.__propagate(wasMatch ? "modify" : "assert", context);
            } else if (wasMatch) {
                this.__propagate("retract", context);
            }
        },

        retract: function (context) {
            var hashCode = context.pathsHash,
                memory = this.memory;
            if (memory[hashCode]) {
                this.__propagate("retract", context);
            }
            memory[hashCode] = null;
        },

        toString: function () {
            return "EqualityNode" + this.__count;
        }
    }
}).as(module);
},{"./alphaNode":20}],23:[function(require,module,exports){
var FromNotNode = require("./fromNotNode"),
    extd = require("../extended"),
    Context = require("../context"),
    isDefined = extd.isDefined,
    isArray = extd.isArray;

FromNotNode.extend({
    instance: {

        nodeType: "ExistsFromNode",

        retractLeft: function (context) {
            var ctx = this.removeFromLeftMemory(context);
            if (ctx) {
                ctx = ctx.data;
                if (ctx.blocked) {
                    this.__propagate("retract", ctx.clone());
                }
            }
        },

        __modify: function (context, leftContext) {
            var leftContextBlocked = leftContext.blocked;
            var fh = context.factHash, o = this.from(fh);
            if (isArray(o)) {
                for (var i = 0, l = o.length; i < l; i++) {
                    if (this.__isMatch(context, o[i], true)) {
                        context.blocked = true;
                        break;
                    }
                }
            } else if (isDefined(o)) {
                context.blocked = this.__isMatch(context, o, true);
            }
            var newContextBlocked = context.blocked;
            if (newContextBlocked) {
                if (leftContextBlocked) {
                    this.__propagate("modify", context.clone());
                } else {
                    this.__propagate("assert", context.clone());
                }
            } else if (leftContextBlocked) {
                this.__propagate("retract", context.clone());
            }

        },

        __findMatches: function (context) {
            var fh = context.factHash, o = this.from(fh), isMatch = false;
            if (isArray(o)) {
                for (var i = 0, l = o.length; i < l; i++) {
                    if (this.__isMatch(context, o[i], true)) {
                        context.blocked = true;
                        this.__propagate("assert", context.clone());
                        return;
                    }
                }
            } else if (isDefined(o) && (this.__isMatch(context, o, true))) {
                context.blocked = true;
                this.__propagate("assert", context.clone());
            }
            return isMatch;
        },

        __isMatch: function (oc, o, add) {
            var ret = false;
            if (this.type(o)) {
                var createdFact = this.workingMemory.getFactHandle(o);
                var context = new Context(createdFact, null, null)
                    .mergeMatch(oc.match)
                    .set(this.alias, o);
                if (add) {
                    var fm = this.fromMemory[createdFact.id];
                    if (!fm) {
                        fm = this.fromMemory[createdFact.id] = {};
                    }
                    fm[oc.hashCode] = oc;
                }
                var fh = context.factHash;
                var eqConstraints = this.__equalityConstraints;
                for (var i = 0, l = eqConstraints.length; i < l; i++) {
                    if (eqConstraints[i](fh)) {
                        ret = true;
                    } else {
                        ret = false;
                        break;
                    }
                }
            }
            return ret;
        },

        assertLeft: function (context) {
            this.__addToLeftMemory(context);
            this.__findMatches(context);
        }

    }
}).as(module);
},{"../context":10,"../extended":12,"./fromNotNode":26}],24:[function(require,module,exports){
var NotNode = require("./notNode"),
    LinkedList = require("../linkedList");


NotNode.extend({
    instance: {

        nodeType: "ExistsNode",

        blockedContext: function (leftContext, rightContext) {
            leftContext.blocker = rightContext;
            this.removeFromLeftMemory(leftContext);
            this.addToLeftBlockedMemory(rightContext.blocking.push(leftContext));
            this.__propagate("assert", this.__cloneContext(leftContext));
        },

        notBlockedContext: function (leftContext, propagate) {
            this.__addToLeftMemory(leftContext);
            propagate && this.__propagate("retract", this.__cloneContext(leftContext));
        },

        propagateFromLeft: function (leftContext) {
            this.notBlockedContext(leftContext, false);
        },


        retractLeft: function (context) {
            var ctx;
            if (!this.removeFromLeftMemory(context)) {
                if ((ctx = this.removeFromLeftBlockedMemory(context))) {
                    this.__propagate("retract", this.__cloneContext(ctx.data));
                } else {
                    throw new Error();
                }
            }
        },
       
        modifyLeft: function (context) {
            var ctx = this.removeFromLeftMemory(context),
                leftContext,
                thisConstraint = this.constraint,
                rightTuples = this.rightTuples,
                l = rightTuples.length,
                isBlocked = false,
                node, rc, blocker;
            if (!ctx) {
                //blocked before
                ctx = this.removeFromLeftBlockedMemory(context);
                isBlocked = true;
            }
            if (ctx) {
                leftContext = ctx.data;

                if (leftContext && leftContext.blocker) {
                    //we were blocked before so only check nodes previous to our blocker
                    blocker = this.rightMemory[leftContext.blocker.hashCode];
                }
                if (blocker) {
                    if (thisConstraint.isMatch(context, rc = blocker.data)) {
                        //propogate as a modify or assert
                        this.__propagate(!isBlocked ? "assert" : "modify", this.__cloneContext(leftContext));
                        context.blocker = rc;
                        this.addToLeftBlockedMemory(rc.blocking.push(context));
                        context = null;
                    }
                    if (context) {
                        node = {next: blocker.next};
                    }
                } else {
                    node = {next: rightTuples.head};
                }
                if (context && l) {
                    node = {next: rightTuples.head};
                    //we were propagated before
                    while ((node = node.next)) {
                        if (thisConstraint.isMatch(context, rc = node.data)) {
                            //we cant be proagated so retract previous

                            //we were asserted before so retract
                            this.__propagate(!isBlocked ? "assert" : "modify", this.__cloneContext(leftContext));

                            this.addToLeftBlockedMemory(rc.blocking.push(context));
                            context.blocker = rc;
                            context = null;
                            break;
                        }
                    }
                }
                if (context) {
                    //we can still be propogated
                    this.__addToLeftMemory(context);
                    if (isBlocked) {
                        //we were blocked so retract
                        this.__propagate("retract", this.__cloneContext(context));
                    }

                }
            } else {
                throw new Error();
            }

        },

        modifyRight: function (context) {
            var ctx = this.removeFromRightMemory(context);
            if (ctx) {
                var rightContext = ctx.data,
                    leftTuples = this.leftTuples,
                    leftTuplesLength = leftTuples.length,
                    leftContext,
                    thisConstraint = this.constraint,
                    node,
                    blocking = rightContext.blocking;
                this.__addToRightMemory(context);
                context.blocking = new LinkedList();
                if (leftTuplesLength || blocking.length) {
                    if (blocking.length) {
                        var rc;
                        //check old blocked contexts
                        //check if the same contexts blocked before are still blocked
                        var blockingNode = {next: blocking.head};
                        while ((blockingNode = blockingNode.next)) {
                            leftContext = blockingNode.data;
                            leftContext.blocker = null;
                            if (thisConstraint.isMatch(leftContext, context)) {
                                leftContext.blocker = context;
                                this.addToLeftBlockedMemory(context.blocking.push(leftContext));
                                this.__propagate("assert", this.__cloneContext(leftContext));
                                leftContext = null;
                            } else {
                                //we arent blocked anymore
                                leftContext.blocker = null;
                                node = ctx;
                                while ((node = node.next)) {
                                    if (thisConstraint.isMatch(leftContext, rc = node.data)) {
                                        leftContext.blocker = rc;
                                        this.addToLeftBlockedMemory(rc.blocking.push(leftContext));
                                        this.__propagate("assert", this.__cloneContext(leftContext));
                                        leftContext = null;
                                        break;
                                    }
                                }
                                if (leftContext) {
                                    this.__addToLeftMemory(leftContext);
                                }
                            }
                        }
                    }

                    if (leftTuplesLength) {
                        //check currently left tuples in memory
                        node = {next: leftTuples.head};
                        while ((node = node.next)) {
                            leftContext = node.data;
                            if (thisConstraint.isMatch(leftContext, context)) {
                                this.__propagate("assert", this.__cloneContext(leftContext));
                                this.removeFromLeftMemory(leftContext);
                                this.addToLeftBlockedMemory(context.blocking.push(leftContext));
                                leftContext.blocker = context;
                            }
                        }
                    }


                }
            } else {
                throw new Error();
            }


        }
    }
}).as(module);
},{"../linkedList":16,"./notNode":38}],25:[function(require,module,exports){
var JoinNode = require("./joinNode"),
    extd = require("../extended"),
    constraint = require("../constraint"),
    EqualityConstraint = constraint.EqualityConstraint,
    HashConstraint = constraint.HashConstraint,
    ReferenceConstraint = constraint.ReferenceConstraint,
    Context = require("../context"),
    isDefined = extd.isDefined,
    isEmpty = extd.isEmpty,
    forEach = extd.forEach,
    isArray = extd.isArray;

var DEFAULT_MATCH = {
    isMatch: function () {
        return false;
    }
};

JoinNode.extend({
    instance: {

        nodeType: "FromNode",

        constructor: function (pattern, wm) {
            this._super(arguments);
            this.workingMemory = wm;
            this.fromMemory = {};
            this.pattern = pattern;
            this.type = pattern.get("constraints")[0].assert;
            this.alias = pattern.get("alias");
            this.from = pattern.from.assert;
            var eqConstraints = this.__equalityConstraints = [];
            var vars = [];
            forEach(this.constraints = this.pattern.get("constraints").slice(1), function (c) {
                if (c instanceof EqualityConstraint || c instanceof ReferenceConstraint) {
                    eqConstraints.push(c.assert);
                } else if (c instanceof HashConstraint) {
                    vars = vars.concat(c.get("variables"));
                }
            });
            this.__variables = vars;
        },

        __createMatches: function (context) {
            var fh = context.factHash, o = this.from(fh);
            if (isArray(o)) {
                for (var i = 0, l = o.length; i < l; i++) {
                    this.__checkMatch(context, o[i], true);
                }
            } else if (isDefined(o)) {
                this.__checkMatch(context, o, true);
            }
        },

        __checkMatch: function (context, o, propogate) {
            var newContext;
            if ((newContext = this.__createMatch(context, o)).isMatch() && propogate) {
                this.__propagate("assert", newContext.clone());
            }
            return newContext;
        },

        __createMatch: function (lc, o) {
            if (this.type(o)) {
                var createdFact = this.workingMemory.getFactHandle(o, true),
                    createdContext,
                    rc = new Context(createdFact, null, null)
                        .set(this.alias, o),
                    createdFactId = createdFact.id;
                var fh = rc.factHash, lcFh = lc.factHash;
                for (var key in lcFh) {
                    fh[key] = lcFh[key];
                }
                var eqConstraints = this.__equalityConstraints, vars = this.__variables, i = -1, l = eqConstraints.length;
                while (++i < l) {
                    if (!eqConstraints[i](fh, fh)) {
                        createdContext = DEFAULT_MATCH;
                        break;
                    }
                }
                var fm = this.fromMemory[createdFactId];
                if (!fm) {
                    fm = this.fromMemory[createdFactId] = {};
                }
                if (!createdContext) {
                    var prop;
                    i = -1;
                    l = vars.length;
                    while (++i < l) {
                        prop = vars[i];
                        fh[prop] = o[prop];
                    }
                    lc.fromMatches[createdFact.id] = createdContext = rc.clone(createdFact, null, lc.match.merge(rc.match));
                }
                fm[lc.hashCode] = [lc, createdContext];
                return createdContext;
            }
            return DEFAULT_MATCH;
        },

        retractRight: function () {
            throw new Error("Shouldnt have gotten here");
        },

        removeFromFromMemory: function (context) {
            var factId = context.fact.id;
            var fm = this.fromMemory[factId];
            if (fm) {
                var entry;
                for (var i in fm) {
                    entry = fm[i];
                    if (entry[1] === context) {
                        delete fm[i];
                        if (isEmpty(fm)) {
                            delete this.fromMemory[factId];
                        }
                        break;
                    }
                }
            }

        },

        retractLeft: function (context) {
            var ctx = this.removeFromLeftMemory(context);
            if (ctx) {
                ctx = ctx.data;
                var fromMatches = ctx.fromMatches;
                for (var i in fromMatches) {
                    this.removeFromFromMemory(fromMatches[i]);
                    this.__propagate("retract", fromMatches[i].clone());
                }
            }
        },

        modifyLeft: function (context) {
            var ctx = this.removeFromLeftMemory(context), newContext, i, l, factId, fact;
            if (ctx) {
                this.__addToLeftMemory(context);

                var leftContext = ctx.data,
                    fromMatches = (context.fromMatches = {}),
                    rightMatches = leftContext.fromMatches,
                    o = this.from(context.factHash);

                if (isArray(o)) {
                    for (i = 0, l = o.length; i < l; i++) {
                        newContext = this.__checkMatch(context, o[i], false);
                        if (newContext.isMatch()) {
                            factId = newContext.fact.id;
                            if (factId in rightMatches) {
                                this.__propagate("modify", newContext.clone());
                            } else {
                                this.__propagate("assert", newContext.clone());
                            }
                        }
                    }
                } else if (isDefined(o)) {
                    newContext = this.__checkMatch(context, o, false);
                    if (newContext.isMatch()) {
                        factId = newContext.fact.id;
                        if (factId in rightMatches) {
                            this.__propagate("modify", newContext.clone());
                        } else {
                            this.__propagate("assert", newContext.clone());
                        }
                    }
                }
                for (i in rightMatches) {
                    if (!(i in fromMatches)) {
                        this.removeFromFromMemory(rightMatches[i]);
                        this.__propagate("retract", rightMatches[i].clone());
                    }
                }
            } else {
                this.assertLeft(context);
            }
            fact = context.fact;
            factId = fact.id;
            var fm = this.fromMemory[factId];
            this.fromMemory[factId] = {};
            if (fm) {
                var lc, entry, cc, createdIsMatch, factObject = fact.object;
                for (i in fm) {
                    entry = fm[i];
                    lc = entry[0];
                    cc = entry[1];
                    createdIsMatch = cc.isMatch();
                    if (lc.hashCode !== context.hashCode) {
                        newContext = this.__createMatch(lc, factObject, false);
                        if (createdIsMatch) {
                            this.__propagate("retract", cc.clone());
                        }
                        if (newContext.isMatch()) {
                            this.__propagate(createdIsMatch ? "modify" : "assert", newContext.clone());
                        }

                    }
                }
            }
        },

        assertLeft: function (context) {
            this.__addToLeftMemory(context);
            context.fromMatches = {};
            this.__createMatches(context);
        },

        assertRight: function () {
            throw new Error("Shouldnt have gotten here");
        }

    }
}).as(module);
},{"../constraint":8,"../context":10,"../extended":12,"./joinNode":28}],26:[function(require,module,exports){
var JoinNode = require("./joinNode"),
    extd = require("../extended"),
    constraint = require("../constraint"),
    EqualityConstraint = constraint.EqualityConstraint,
    HashConstraint = constraint.HashConstraint,
    ReferenceConstraint = constraint.ReferenceConstraint,
    Context = require("../context"),
    isDefined = extd.isDefined,
    forEach = extd.forEach,
    isArray = extd.isArray;

JoinNode.extend({
    instance: {

        nodeType: "FromNotNode",

        constructor: function (pattern, workingMemory) {
            this._super(arguments);
            this.workingMemory = workingMemory;
            this.pattern = pattern;
            this.type = pattern.get("constraints")[0].assert;
            this.alias = pattern.get("alias");
            this.from = pattern.from.assert;
            this.fromMemory = {};
            var eqConstraints = this.__equalityConstraints = [];
            var vars = [];
            forEach(this.constraints = this.pattern.get("constraints").slice(1), function (c) {
                if (c instanceof EqualityConstraint || c instanceof ReferenceConstraint) {
                    eqConstraints.push(c.assert);
                } else if (c instanceof HashConstraint) {
                    vars = vars.concat(c.get("variables"));
                }
            });
            this.__variables = vars;

        },

        retractLeft: function (context) {
            var ctx = this.removeFromLeftMemory(context);
            if (ctx) {
                ctx = ctx.data;
                if (!ctx.blocked) {
                    this.__propagate("retract", ctx.clone());
                }
            }
        },

        __modify: function (context, leftContext) {
            var leftContextBlocked = leftContext.blocked;
            var fh = context.factHash, o = this.from(fh);
            if (isArray(o)) {
                for (var i = 0, l = o.length; i < l; i++) {
                    if (this.__isMatch(context, o[i], true)) {
                        context.blocked = true;
                        break;
                    }
                }
            } else if (isDefined(o)) {
                context.blocked = this.__isMatch(context, o, true);
            }
            var newContextBlocked = context.blocked;
            if (!newContextBlocked) {
                if (leftContextBlocked) {
                    this.__propagate("assert", context.clone());
                } else {
                    this.__propagate("modify", context.clone());
                }
            } else if (!leftContextBlocked) {
                this.__propagate("retract", leftContext.clone());
            }

        },

        modifyLeft: function (context) {
            var ctx = this.removeFromLeftMemory(context);
            if (ctx) {
                this.__addToLeftMemory(context);
                this.__modify(context, ctx.data);
            } else {
                throw new Error();
            }
            var fm = this.fromMemory[context.fact.id];
            this.fromMemory[context.fact.id] = {};
            if (fm) {
                for (var i in fm) {
                    // update any contexts associated with this fact
                    if (i !== context.hashCode) {
                        var lc = fm[i];
                        ctx = this.removeFromLeftMemory(lc);
                        if (ctx) {
                            lc = lc.clone();
                            lc.blocked = false;
                            this.__addToLeftMemory(lc);
                            this.__modify(lc, ctx.data);
                        }
                    }
                }
            }
        },

        __findMatches: function (context) {
            var fh = context.factHash, o = this.from(fh), isMatch = false;
            if (isArray(o)) {
                for (var i = 0, l = o.length; i < l; i++) {
                    if (this.__isMatch(context, o[i], true)) {
                        context.blocked = true;
                        return;
                    }
                }
                this.__propagate("assert", context.clone());
            } else if (isDefined(o) && !(context.blocked = this.__isMatch(context, o, true))) {
                this.__propagate("assert", context.clone());
            }
            return isMatch;
        },

        __isMatch: function (oc, o, add) {
            var ret = false;
            if (this.type(o)) {
                var createdFact = this.workingMemory.getFactHandle(o);
                var context = new Context(createdFact, null)
                    .mergeMatch(oc.match)
                    .set(this.alias, o);
                if (add) {
                    var fm = this.fromMemory[createdFact.id];
                    if (!fm) {
                        fm = this.fromMemory[createdFact.id] = {};
                    }
                    fm[oc.hashCode] = oc;
                }
                var fh = context.factHash;
                var eqConstraints = this.__equalityConstraints;
                for (var i = 0, l = eqConstraints.length; i < l; i++) {
                    if (eqConstraints[i](fh, fh)) {
                        ret = true;
                    } else {
                        ret = false;
                        break;
                    }
                }
            }
            return ret;
        },

        assertLeft: function (context) {
            this.__addToLeftMemory(context);
            this.__findMatches(context);
        },

        assertRight: function () {
            throw new Error("Shouldnt have gotten here");
        },

        retractRight: function () {
            throw new Error("Shouldnt have gotten here");
        }

    }
}).as(module);
},{"../constraint":8,"../context":10,"../extended":12,"./joinNode":28}],27:[function(require,module,exports){
"use strict";
var extd = require("../extended"),
    forEach = extd.forEach,
    some = extd.some,
    declare = extd.declare,
    pattern = require("../pattern.js"),
    ObjectPattern = pattern.ObjectPattern,
    FromPattern = pattern.FromPattern,
    FromNotPattern = pattern.FromNotPattern,
    ExistsPattern = pattern.ExistsPattern,
    FromExistsPattern = pattern.FromExistsPattern,
    NotPattern = pattern.NotPattern,
    CompositePattern = pattern.CompositePattern,
    InitialFactPattern = pattern.InitialFactPattern,
    constraints = require("../constraint"),
    HashConstraint = constraints.HashConstraint,
    ReferenceConstraint = constraints.ReferenceConstraint,
    AliasNode = require("./aliasNode"),
    EqualityNode = require("./equalityNode"),
    JoinNode = require("./joinNode"),
    BetaNode = require("./betaNode"),
    NotNode = require("./notNode"),
    FromNode = require("./fromNode"),
    FromNotNode = require("./fromNotNode"),
    ExistsNode = require("./existsNode"),
    ExistsFromNode = require("./existsFromNode"),
    LeftAdapterNode = require("./leftAdapterNode"),
    RightAdapterNode = require("./rightAdapterNode"),
    TypeNode = require("./typeNode"),
    TerminalNode = require("./terminalNode"),
    PropertyNode = require("./propertyNode");

function hasRefernceConstraints(pattern) {
    return some(pattern.constraints || [], function (c) {
        return c instanceof ReferenceConstraint;
    });
}

declare({
    instance: {
        constructor: function (wm, agendaTree) {
            this.terminalNodes = [];
            this.joinNodes = [];
            this.nodes = [];
            this.constraints = [];
            this.typeNodes = [];
            this.__ruleCount = 0;
            this.bucket = {
                counter: 0,
                recency: 0
            };
            this.agendaTree = agendaTree;
            this.workingMemory = wm;
        },

        assertRule: function (rule) {
            var terminalNode = new TerminalNode(this.bucket, this.__ruleCount++, rule, this.agendaTree);
            this.__addToNetwork(rule, rule.pattern, terminalNode);
            this.__mergeJoinNodes();
            this.terminalNodes.push(terminalNode);
        },

        resetCounter: function () {
            this.bucket.counter = 0;
        },

        incrementCounter: function () {
            this.bucket.counter++;
        },

        assertFact: function (fact) {
            var typeNodes = this.typeNodes, i = typeNodes.length - 1;
            for (; i >= 0; i--) {
                typeNodes[i].assert(fact);
            }
        },

        retractFact: function (fact) {
            var typeNodes = this.typeNodes, i = typeNodes.length - 1;
            for (; i >= 0; i--) {
                typeNodes[i].retract(fact);
            }
        },

        modifyFact: function (fact) {
            var typeNodes = this.typeNodes, i = typeNodes.length - 1;
            for (; i >= 0; i--) {
                typeNodes[i].modify(fact);
            }
        },


        containsRule: function (name) {
            return some(this.terminalNodes, function (n) {
                return n.rule.name === name;
            });
        },

        dispose: function () {
            var typeNodes = this.typeNodes, i = typeNodes.length - 1;
            for (; i >= 0; i--) {
                typeNodes[i].dispose();
            }
        },

        __mergeJoinNodes: function () {
            var joinNodes = this.joinNodes;
            for (var i = 0; i < joinNodes.length; i++) {
                var j1 = joinNodes[i], j2 = joinNodes[i + 1];
                if (j1 && j2 && (j1.constraint && j2.constraint && j1.constraint.equal(j2.constraint))) {
                    j1.merge(j2);
                    joinNodes.splice(i + 1, 1);
                }
            }
        },

        __checkEqual: function (node) {
            var constraints = this.constraints, i = constraints.length - 1;
            for (; i >= 0; i--) {
                var n = constraints[i];
                if (node.equal(n)) {
                    return  n;
                }
            }
            constraints.push(node);
            return node;
        },

        __createTypeNode: function (rule, pattern) {
            var ret = new TypeNode(pattern.get("constraints")[0]);
            var constraints = this.typeNodes, i = constraints.length - 1;
            for (; i >= 0; i--) {
                var n = constraints[i];
                if (ret.equal(n)) {
                    return  n;
                }
            }
            constraints.push(ret);
            return ret;
        },

        __createEqualityNode: function (rule, constraint) {
            return this.__checkEqual(new EqualityNode(constraint)).addRule(rule);
        },

        __createPropertyNode: function (rule, constraint) {
            return this.__checkEqual(new PropertyNode(constraint)).addRule(rule);
        },

        __createAliasNode: function (rule, pattern) {
            return this.__checkEqual(new AliasNode(pattern)).addRule(rule);
        },

        __createAdapterNode: function (rule, side) {
            return (side === "left" ? new LeftAdapterNode() : new RightAdapterNode()).addRule(rule);
        },

        __createJoinNode: function (rule, pattern, outNode, side) {
            var joinNode;
            if (pattern.rightPattern instanceof NotPattern) {
                joinNode = new NotNode();
            } else if (pattern.rightPattern instanceof FromExistsPattern) {
                joinNode = new ExistsFromNode(pattern.rightPattern, this.workingMemory);
            } else if (pattern.rightPattern instanceof ExistsPattern) {
                joinNode = new ExistsNode();
            } else if (pattern.rightPattern instanceof FromNotPattern) {
                joinNode = new FromNotNode(pattern.rightPattern, this.workingMemory);
            } else if (pattern.rightPattern instanceof FromPattern) {
                joinNode = new FromNode(pattern.rightPattern, this.workingMemory);
            } else if (pattern instanceof CompositePattern && !hasRefernceConstraints(pattern.leftPattern) && !hasRefernceConstraints(pattern.rightPattern)) {
                joinNode = new BetaNode();
                this.joinNodes.push(joinNode);
            } else {
                joinNode = new JoinNode();
                this.joinNodes.push(joinNode);
            }
            joinNode["__rule__"] = rule;
            var parentNode = joinNode;
            if (outNode instanceof BetaNode) {
                var adapterNode = this.__createAdapterNode(rule, side);
                parentNode.addOutNode(adapterNode, pattern);
                parentNode = adapterNode;
            }
            parentNode.addOutNode(outNode, pattern);
            return joinNode.addRule(rule);
        },

        __addToNetwork: function (rule, pattern, outNode, side) {
            if (pattern instanceof ObjectPattern) {
                if (!(pattern instanceof InitialFactPattern) && (!side || side === "left")) {
                    this.__createBetaNode(rule, new CompositePattern(new InitialFactPattern(), pattern), outNode, side);
                } else {
                    this.__createAlphaNode(rule, pattern, outNode, side);
                }
            } else if (pattern instanceof CompositePattern) {
                this.__createBetaNode(rule, pattern, outNode, side);
            }
        },

        __createBetaNode: function (rule, pattern, outNode, side) {
            var joinNode = this.__createJoinNode(rule, pattern, outNode, side);
            this.__addToNetwork(rule, pattern.rightPattern, joinNode, "right");
            this.__addToNetwork(rule, pattern.leftPattern, joinNode, "left");
            outNode.addParentNode(joinNode);
            return joinNode;
        },


        __createAlphaNode: function (rule, pattern, outNode, side) {
            var typeNode, parentNode;
            if (!(pattern instanceof FromPattern)) {

                var constraints = pattern.get("constraints");
                typeNode = this.__createTypeNode(rule, pattern);
                var aliasNode = this.__createAliasNode(rule, pattern);
                typeNode.addOutNode(aliasNode, pattern);
                aliasNode.addParentNode(typeNode);
                parentNode = aliasNode;
                var i = constraints.length - 1;
                for (; i > 0; i--) {
                    var constraint = constraints[i], node;
                    if (constraint instanceof HashConstraint) {
                        node = this.__createPropertyNode(rule, constraint);
                    } else if (constraint instanceof ReferenceConstraint) {
                        outNode.constraint.addConstraint(constraint);
                        continue;
                    } else {
                        node = this.__createEqualityNode(rule, constraint);
                    }
                    parentNode.addOutNode(node, pattern);
                    node.addParentNode(parentNode);
                    parentNode = node;
                }

                if (outNode instanceof BetaNode) {
                    var adapterNode = this.__createAdapterNode(rule, side);
                    adapterNode.addParentNode(parentNode);
                    parentNode.addOutNode(adapterNode, pattern);
                    parentNode = adapterNode;
                }
                outNode.addParentNode(parentNode);
                parentNode.addOutNode(outNode, pattern);
                return typeNode;
            }
        },

        print: function () {
            forEach(this.terminalNodes, function (t) {
                t.print("    ");
            });
        }
    }
}).as(exports, "RootNode");






},{"../constraint":8,"../extended":12,"../pattern.js":48,"./aliasNode":19,"./betaNode":21,"./equalityNode":22,"./existsFromNode":23,"./existsNode":24,"./fromNode":25,"./fromNotNode":26,"./joinNode":28,"./leftAdapterNode":30,"./notNode":38,"./propertyNode":39,"./rightAdapterNode":40,"./terminalNode":41,"./typeNode":42}],28:[function(require,module,exports){
var BetaNode = require("./betaNode"),
    JoinReferenceNode = require("./joinReferenceNode");

BetaNode.extend({

    instance: {
        constructor: function () {
            this._super(arguments);
            this.constraint = new JoinReferenceNode(this.leftTuples, this.rightTuples);
        },

        nodeType: "JoinNode",

        propagateFromLeft: function (context, rm) {
            var mr;
            if ((mr = this.constraint.match(context, rm)).isMatch) {
                this.__propagate("assert", this.__addToMemoryMatches(rm, context, context.clone(null, null, mr)));
            }
            return this;
        },

        propagateFromRight: function (context, lm) {
            var mr;
            if ((mr = this.constraint.match(lm, context)).isMatch) {
                this.__propagate("assert", this.__addToMemoryMatches(context, lm, context.clone(null, null, mr)));
            }
            return this;
        },

        propagateAssertModifyFromLeft: function (context, rightMatches, rm) {
            var factId = rm.hashCode, mr;
            if (factId in rightMatches) {
                mr = this.constraint.match(context, rm);
                var mrIsMatch = mr.isMatch;
                if (!mrIsMatch) {
                    this.__propagate("retract", rightMatches[factId].clone());
                } else {
                    this.__propagate("modify", this.__addToMemoryMatches(rm, context, context.clone(null, null, mr)));
                }
            } else {
                this.propagateFromLeft(context, rm);
            }
        },

        propagateAssertModifyFromRight: function (context, leftMatches, lm) {
            var factId = lm.hashCode, mr;
            if (factId in leftMatches) {
                mr = this.constraint.match(lm, context);
                var mrIsMatch = mr.isMatch;
                if (!mrIsMatch) {
                    this.__propagate("retract", leftMatches[factId].clone());
                } else {
                    this.__propagate("modify", this.__addToMemoryMatches(context, lm, context.clone(null, null, mr)));
                }
            } else {
                this.propagateFromRight(context, lm);
            }
        }
    }

}).as(module);
},{"./betaNode":21,"./joinReferenceNode":29}],29:[function(require,module,exports){
var Node = require("./node"),
    constraints = require("../constraint"),
    ReferenceEqualityConstraint = constraints.ReferenceEqualityConstraint;

var DEFUALT_CONSTRAINT = {
    isDefault: true,
    assert: function () {
        return true;
    },

    equal: function () {
        return false;
    }
};

var inversions = {
    "gt": "lte",
    "gte": "lte",
    "lt": "gte",
    "lte": "gte",
    "eq": "eq",
    "neq": "neq"
};

function normalizeRightIndexConstraint(rightIndex, indexes, op) {
    if (rightIndex === indexes[1]) {
        op = inversions[op];
    }
    return op;
}

function normalizeLeftIndexConstraint(leftIndex, indexes, op) {
    if (leftIndex === indexes[1]) {
        op = inversions[op];
    }
    return op;
}

Node.extend({

    instance: {

        constraint: DEFUALT_CONSTRAINT,

        constructor: function (leftMemory, rightMemory) {
            this._super(arguments);
            this.constraint = DEFUALT_CONSTRAINT;
            this.constraintAssert = DEFUALT_CONSTRAINT.assert;
            this.rightIndexes = [];
            this.leftIndexes = [];
            this.constraintLength = 0;
            this.leftMemory = leftMemory;
            this.rightMemory = rightMemory;
        },

        addConstraint: function (constraint) {
            if (constraint instanceof ReferenceEqualityConstraint) {
                var identifiers = constraint.getIndexableProperties();
                var alias = constraint.get("alias");
                if (identifiers.length === 2 && alias) {
                    var leftIndex, rightIndex, i = -1, indexes = [];
                    while (++i < 2) {
                        var index = identifiers[i];
                        if (index.match(new RegExp("^" + alias + "(\\.?)")) === null) {
                            indexes.push(index);
                            leftIndex = index;
                        } else {
                            indexes.push(index);
                            rightIndex = index;
                        }
                    }
                    if (leftIndex && rightIndex) {
                        var leftOp = normalizeLeftIndexConstraint(leftIndex, indexes, constraint.op),
                            rightOp = normalizeRightIndexConstraint(rightIndex, indexes, constraint.op);
                        this.rightMemory.addIndex(rightIndex, leftIndex, rightOp);
                        this.leftMemory.addIndex(leftIndex, rightIndex, leftOp);
                    }
                }
            }
            if (this.constraint.isDefault) {
                this.constraint = constraint;
                this.isDefault = false;
            } else {
                this.constraint = this.constraint.merge(constraint);
            }
            this.constraintAssert = this.constraint.assert;

        },

        equal: function (constraint) {
            return this.constraint.equal(constraint.constraint);
        },

        isMatch: function (lc, rc) {
            return this.constraintAssert(lc.factHash, rc.factHash);
        },

        match: function (lc, rc) {
            var ret = {isMatch: false};
            if (this.constraintAssert(lc.factHash, rc.factHash)) {
                ret = lc.match.merge(rc.match);
            }
            return ret;
        }

    }

}).as(module);
},{"../constraint":8,"./node":37}],30:[function(require,module,exports){
var Node = require("./adapterNode");

Node.extend({
    instance: {
        propagateAssert: function (context) {
            this.__propagate("assertLeft", context);
        },

        propagateRetract: function (context) {
            this.__propagate("retractLeft", context);
        },

        propagateResolve: function (context) {
            this.__propagate("retractResolve", context);
        },

        propagateModify: function (context) {
            this.__propagate("modifyLeft", context);
        },

        retractResolve: function (match) {
            this.__propagate("retractResolve", match);
        },

        dispose: function (context) {
            this.propagateDispose(context);
        },

        toString: function () {
            return "LeftAdapterNode " + this.__count;
        }
    }

}).as(module);
},{"./adapterNode":18}],31:[function(require,module,exports){
exports.getMemory = (function () {

    var pPush = Array.prototype.push, NPL = 0, EMPTY_ARRAY = [], NOT_POSSIBLES_HASH = {}, POSSIBLES_HASH = {}, PL = 0;

    function mergePossibleTuples(ret, a, l) {
        var val, j = 0, i = -1;
        if (PL < l) {
            while (PL && ++i < l) {
                if (POSSIBLES_HASH[(val = a[i]).hashCode]) {
                    ret[j++] = val;
                    PL--;
                }
            }
        } else {
            pPush.apply(ret, a);
        }
        PL = 0;
        POSSIBLES_HASH = {};
    }


    function mergeNotPossibleTuples(ret, a, l) {
        var val, j = 0, i = -1;
        if (NPL < l) {
            while (++i < l) {
                if (!NPL) {
                    ret[j++] = a[i];
                } else if (!NOT_POSSIBLES_HASH[(val = a[i]).hashCode]) {
                    ret[j++] = val;
                } else {
                    NPL--;
                }
            }
        }
        NPL = 0;
        NOT_POSSIBLES_HASH = {};
    }

    function mergeBothTuples(ret, a, l) {
        if (PL === l) {
            mergeNotPossibles(ret, a, l);
        } else if (NPL < l) {
            var val, j = 0, i = -1, hashCode;
            while (++i < l) {
                if (!NOT_POSSIBLES_HASH[(hashCode = (val = a[i]).hashCode)] && POSSIBLES_HASH[hashCode]) {
                    ret[j++] = val;
                }
            }
        }
        NPL = 0;
        NOT_POSSIBLES_HASH = {};
        PL = 0;
        POSSIBLES_HASH = {};
    }

    function mergePossiblesAndNotPossibles(a, l) {
        var ret = EMPTY_ARRAY;
        if (l) {
            if (NPL || PL) {
                ret = [];
                if (!NPL) {
                    mergePossibleTuples(ret, a, l);
                } else if (!PL) {
                    mergeNotPossibleTuples(ret, a, l);
                } else {
                    mergeBothTuples(ret, a, l);
                }
            } else {
                ret = a;
            }
        }
        return ret;
    }

    function getRangeTuples(op, currEntry, val) {
        var ret;
        if (op === "gt") {
            ret = currEntry.findGT(val);
        } else if (op === "gte") {
            ret = currEntry.findGTE(val);
        } else if (op === "lt") {
            ret = currEntry.findLT(val);
        } else if (op === "lte") {
            ret = currEntry.findLTE(val);
        }
        return ret;
    }

    function mergeNotPossibles(tuples, tl) {
        if (tl) {
            var j = -1, hashCode;
            while (++j < tl) {
                hashCode = tuples[j].hashCode;
                if (!NOT_POSSIBLES_HASH[hashCode]) {
                    NOT_POSSIBLES_HASH[hashCode] = true;
                    NPL++;
                }
            }
        }
    }

    function mergePossibles(tuples, tl) {
        if (tl) {
            var j = -1, hashCode;
            while (++j < tl) {
                hashCode = tuples[j].hashCode;
                if (!POSSIBLES_HASH[hashCode]) {
                    POSSIBLES_HASH[hashCode] = true;
                    PL++;
                }
            }
        }
    }

    return function _getMemory(entry, factHash, indexes) {
        var i = -1, l = indexes.length,
            ret = entry.tuples,
            rl = ret.length,
            intersected = false,
            tables = entry.tables,
            index, val, op, nextEntry, currEntry, tuples, tl;
        while (++i < l && rl) {
            index = indexes[i];
            val = index[3](factHash);
            op = index[4];
            currEntry = tables[index[0]];
            if (op === "eq" || op === "seq") {
                if ((nextEntry = currEntry.get(val))) {
                    rl = (ret = (entry = nextEntry).tuples).length;
                    tables = nextEntry.tables;
                } else {
                    rl = (ret = EMPTY_ARRAY).length;
                }
            } else if (op === "neq" || op === "sneq") {
                if ((nextEntry = currEntry.get(val))) {
                    tl = (tuples = nextEntry.tuples).length;
                    mergeNotPossibles(tuples, tl);
                }
            } else if (!intersected) {
                rl = (ret = getRangeTuples(op, currEntry, val)).length;
                intersected = true;
            } else if ((tl = (tuples = getRangeTuples(op, currEntry, val)).length)) {
                mergePossibles(tuples, tl);
            } else {
                ret = tuples;
                rl = tl;
            }
        }
        return mergePossiblesAndNotPossibles(ret, rl);
    };
}());
},{}],32:[function(require,module,exports){
var Memory = require("./memory");

Memory.extend({

    instance: {

        getLeftMemory: function (tuple) {
            return this.getMemory(tuple);
        }
    }

}).as(module);
},{"./memory":33}],33:[function(require,module,exports){
var extd = require("../../extended"),
    plucker = extd.plucker,
    declare = extd.declare,
    getMemory = require("./helpers").getMemory,
    Table = require("./table"),
    TupleEntry = require("./tupleEntry");


var id = 0;
declare({

    instance: {
        length: 0,

        constructor: function () {
            this.head = null;
            this.tail = null;
            this.indexes = [];
            this.tables = new TupleEntry(null, new Table(), false);
        },

        push: function (data) {
            var tail = this.tail, head = this.head, node = {data: data, tuples: [], hashCode: id++, prev: tail, next: null};
            if (tail) {
                this.tail.next = node;
            }
            this.tail = node;
            if (!head) {
                this.head = node;
            }
            this.length++;
            this.__index(node);
            this.tables.addNode(node);
            return node;
        },

        remove: function (node) {
            if (node.prev) {
                node.prev.next = node.next;
            } else {
                this.head = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            } else {
                this.tail = node.prev;
            }
            this.tables.removeNode(node);
            this.__removeFromIndex(node);
            this.length--;
        },

        forEach: function (cb) {
            var head = {next: this.head};
            while ((head = head.next)) {
                cb(head.data);
            }
        },

        toArray: function () {
            return this.tables.tuples.slice();
        },

        clear: function () {
            this.head = this.tail = null;
            this.length = 0;
            this.clearIndexes();
        },

        clearIndexes: function () {
            this.tables = {};
            this.indexes.length = 0;
        },

        __index: function (node) {
            var data = node.data,
                factHash = data.factHash,
                indexes = this.indexes,
                entry = this.tables,
                i = -1, l = indexes.length,
                tuples, index, val, path, tables, currEntry, prevLookup;
            while (++i < l) {
                index = indexes[i];
                val = index[2](factHash);
                path = index[0];
                tables = entry.tables;
                if (!(tuples = (currEntry = tables[path] || (tables[path] = new Table())).get(val))) {
                    tuples = new TupleEntry(val, currEntry, true);
                    currEntry.set(val, tuples);
                }
                if (currEntry !== prevLookup) {
                    node.tuples.push(tuples.addNode(node));
                }
                prevLookup = currEntry;
                if (index[4] === "eq") {
                    entry = tuples;
                }
            }
        },

        __removeFromIndex: function (node) {
            var tuples = node.tuples, i = tuples.length;
            while (--i >= 0) {
                tuples[i].removeNode(node);
            }
            node.tuples.length = 0;
        },

        getMemory: function (tuple) {
            var ret;
            if (!this.length) {
                ret = [];
            } else {
                ret = getMemory(this.tables, tuple.factHash, this.indexes);
            }
            return ret;
        },

        __createIndexTree: function () {
            var table = this.tables.tables = {};
            var indexes = this.indexes;
            table[indexes[0][0]] = new Table();
        },


        addIndex: function (primary, lookup, op) {
            this.indexes.push([primary, lookup, plucker(primary), plucker(lookup), op || "eq"]);
            this.indexes.sort(function (a, b) {
                var aOp = a[4], bOp = b[4];
                return aOp === bOp ? 0 : aOp > bOp ? 1 : aOp === bOp ? 0 : -1;
            });
            this.__createIndexTree();

        }

    }

}).as(module);
},{"../../extended":12,"./helpers":31,"./table":35,"./tupleEntry":36}],34:[function(require,module,exports){
var Memory = require("./memory");

Memory.extend({

    instance: {

        getRightMemory: function (tuple) {
            return this.getMemory(tuple);
        }
    }

}).as(module);
},{"./memory":33}],35:[function(require,module,exports){
var extd = require("../../extended"),
    pPush = Array.prototype.push,
    HashTable = extd.HashTable,
    AVLTree = extd.AVLTree;

function compare(a, b) {
    /*jshint eqeqeq: false*/
    a = a.key;
    b = b.key;
    var ret;
    if (a == b) {
        ret = 0;
    } else if (a > b) {
        ret = 1;
    } else if (a < b) {
        ret = -1;
    } else {
        ret = 1;
    }
    return ret;
}

function compareGT(v1, v2) {
    return compare(v1, v2) === 1;
}
function compareGTE(v1, v2) {
    return compare(v1, v2) !== -1;
}

function compareLT(v1, v2) {
    return compare(v1, v2) === -1;
}
function compareLTE(v1, v2) {
    return compare(v1, v2) !== 1;
}

var STACK = [],
    VALUE = {key: null};
function traverseInOrder(tree, key, comparator) {
    VALUE.key = key;
    var ret = [];
    var i = 0, current = tree.__root, v;
    while (true) {
        if (current) {
            current = (STACK[i++] = current).left;
        } else {
            if (i > 0) {
                v = (current = STACK[--i]).data;
                if (comparator(v, VALUE)) {
                    pPush.apply(ret, v.value.tuples);
                    current = current.right;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }
    STACK.length = 0;
    return ret;
}

function traverseReverseOrder(tree, key, comparator) {
    VALUE.key = key;
    var ret = [];
    var i = 0, current = tree.__root, v;
    while (true) {
        if (current) {
            current = (STACK[i++] = current).right;
        } else {
            if (i > 0) {
                v = (current = STACK[--i]).data;
                if (comparator(v, VALUE)) {
                    pPush.apply(ret, v.value.tuples);
                    current = current.left;
                } else {
                    break;
                }
            } else {
                break;
            }
        }
    }
    STACK.length = 0;
    return ret;
}

AVLTree.extend({
    instance: {

        constructor: function () {
            this._super([
                {
                    compare: compare
                }
            ]);
            this.gtCache = new HashTable();
            this.gteCache = new HashTable();
            this.ltCache = new HashTable();
            this.lteCache = new HashTable();
            this.hasGTCache = false;
            this.hasGTECache = false;
            this.hasLTCache = false;
            this.hasLTECache = false;
        },

        clearCache: function () {
            this.hasGTCache && this.gtCache.clear() && (this.hasGTCache = false);
            this.hasGTECache && this.gteCache.clear() && (this.hasGTECache = false);
            this.hasLTCache && this.ltCache.clear() && (this.hasLTCache = false);
            this.hasLTECache && this.lteCache.clear() && (this.hasLTECache = false);
        },

        contains: function (key) {
            return  this._super([
                {key: key}
            ]);
        },

        "set": function (key, value) {
            this.insert({key: key, value: value});
            this.clearCache();
        },

        "get": function (key) {
            var ret = this.find({key: key});
            return ret && ret.value;
        },

        "remove": function (key) {
            this.clearCache();
            return this._super([
                {key: key}
            ]);
        },

        findGT: function (key) {
            var ret = this.gtCache.get(key);
            if (!ret) {
                this.hasGTCache = true;
                this.gtCache.put(key, (ret = traverseReverseOrder(this, key, compareGT)));
            }
            return ret;
        },

        findGTE: function (key) {
            var ret = this.gteCache.get(key);
            if (!ret) {
                this.hasGTECache = true;
                this.gteCache.put(key, (ret = traverseReverseOrder(this, key, compareGTE)));
            }
            return ret;
        },

        findLT: function (key) {
            var ret = this.ltCache.get(key);
            if (!ret) {
                this.hasLTCache = true;
                this.ltCache.put(key, (ret = traverseInOrder(this, key, compareLT)));
            }
            return ret;
        },

        findLTE: function (key) {
            var ret = this.lteCache.get(key);
            if (!ret) {
                this.hasLTECache = true;
                this.lteCache.put(key, (ret = traverseInOrder(this, key, compareLTE)));
            }
            return ret;
        }

    }
}).as(module);
},{"../../extended":12}],36:[function(require,module,exports){
var extd = require("../../extended"),
    indexOf = extd.indexOf;
//    HashSet = require("./hashSet");


var TUPLE_ID = 0;
extd.declare({

    instance: {
        tuples: null,
        tupleMap: null,
        hashCode: null,
        tables: null,
        entry: null,
        constructor: function (val, entry, canRemove) {
            this.val = val;
            this.canRemove = canRemove;
            this.tuples = [];
            this.tupleMap = {};
            this.hashCode = TUPLE_ID++;
            this.tables = {};
            this.length = 0;
            this.entry = entry;
        },

        addNode: function (node) {
            this.tuples[this.length++] = node;
            if (this.length > 1) {
                this.entry.clearCache();
            }
            return this;
        },

        removeNode: function (node) {
            var tuples = this.tuples, index = indexOf(tuples, node);
            if (index !== -1) {
                tuples.splice(index, 1);
                this.length--;
                this.entry.clearCache();
            }
            if (this.canRemove && !this.length) {
                this.entry.remove(this.val);
            }
        }
    }
}).as(module);
},{"../../extended":12}],37:[function(require,module,exports){
var extd = require("../extended"),
    forEach = extd.forEach,
    indexOf = extd.indexOf,
    intersection = extd.intersection,
    declare = extd.declare,
    HashTable = extd.HashTable,
    Context = require("../context");

var count = 0;
declare({
    instance: {
        constructor: function () {
            this.nodes = new HashTable();
            this.rules = [];
            this.parentNodes = [];
            this.__count = count++;
            this.__entrySet = [];
        },

        addRule: function (rule) {
            if (indexOf(this.rules, rule) === -1) {
                this.rules.push(rule);
            }
            return this;
        },

        merge: function (that) {
            that.nodes.forEach(function (entry) {
                var patterns = entry.value, node = entry.key;
                for (var i = 0, l = patterns.length; i < l; i++) {
                    this.addOutNode(node, patterns[i]);
                }
                that.nodes.remove(node);
            }, this);
            var thatParentNodes = that.parentNodes;
            for (var i = 0, l = that.parentNodes.l; i < l; i++) {
                var parentNode = thatParentNodes[i];
                this.addParentNode(parentNode);
                parentNode.nodes.remove(that);
            }
            return this;
        },

        resolve: function (mr1, mr2) {
            return mr1.hashCode === mr2.hashCode;
        },

        print: function (tab) {
            console.log(tab + this.toString());
            forEach(this.parentNodes, function (n) {
                n.print("    " + tab);
            });
        },

        addOutNode: function (outNode, pattern) {
            if (!this.nodes.contains(outNode)) {
                this.nodes.put(outNode, []);
            }
            this.nodes.get(outNode).push(pattern);
            this.__entrySet = this.nodes.entrySet();
        },

        addParentNode: function (n) {
            if (indexOf(this.parentNodes, n) === -1) {
                this.parentNodes.push(n);
            }
        },

        shareable: function () {
            return false;
        },

        __propagate: function (method, context) {
            var entrySet = this.__entrySet, i = entrySet.length, entry, outNode, paths, continuingPaths;
            while (--i > -1) {
                entry = entrySet[i];
                outNode = entry.key;
                paths = entry.value;

                if ((continuingPaths = intersection(paths, context.paths)).length) {
                    outNode[method](new Context(context.fact, continuingPaths, context.match));
                }

            }
        },

        dispose: function (assertable) {
            this.propagateDispose(assertable);
        },

        retract: function (assertable) {
            this.propagateRetract(assertable);
        },

        propagateDispose: function (assertable, outNodes) {
            outNodes = outNodes || this.nodes;
            var entrySet = this.__entrySet, i = entrySet.length - 1;
            for (; i >= 0; i--) {
                var entry = entrySet[i], outNode = entry.key;
                outNode.dispose(assertable);
            }
        },

        propagateAssert: function (assertable) {
            this.__propagate("assert", assertable);
        },

        propagateRetract: function (assertable) {
            this.__propagate("retract", assertable);
        },

        assert: function (assertable) {
            this.propagateAssert(assertable);
        },

        modify: function (assertable) {
            this.propagateModify(assertable);
        },

        propagateModify: function (assertable) {
            this.__propagate("modify", assertable);
        }
    }

}).as(module);

},{"../context":10,"../extended":12}],38:[function(require,module,exports){
var JoinNode = require("./joinNode"),
    LinkedList = require("../linkedList"),
    Context = require("../context"),
    InitialFact = require("../pattern").InitialFact;


JoinNode.extend({
    instance: {

        nodeType: "NotNode",

        constructor: function () {
            this._super(arguments);
            this.leftTupleMemory = {};
            //use this ensure a unique match for and propagated context.
            this.notMatch = new Context(new InitialFact()).match;
        },

        __cloneContext: function (context) {
            return context.clone(null, null, context.match.merge(this.notMatch));
        },


        retractRight: function (context) {
            var ctx = this.removeFromRightMemory(context),
                rightContext = ctx.data,
                blocking = rightContext.blocking;
            if (blocking.length) {
                //if we are blocking left contexts
                var leftContext, thisConstraint = this.constraint, blockingNode = {next: blocking.head}, rc;
                while ((blockingNode = blockingNode.next)) {
                    leftContext = blockingNode.data;
                    this.removeFromLeftBlockedMemory(leftContext);
                    var rm = this.rightTuples.getRightMemory(leftContext), l = rm.length, i;
                    i = -1;
                    while (++i < l) {
                        if (thisConstraint.isMatch(leftContext, rc = rm[i].data)) {
                            this.blockedContext(leftContext, rc);
                            leftContext = null;
                            break;
                        }
                    }
                    if (leftContext) {
                        this.notBlockedContext(leftContext, true);
                    }
                }
                blocking.clear();
            }

        },

        blockedContext: function (leftContext, rightContext, propagate) {
            leftContext.blocker = rightContext;
            this.removeFromLeftMemory(leftContext);
            this.addToLeftBlockedMemory(rightContext.blocking.push(leftContext));
            propagate && this.__propagate("retract", this.__cloneContext(leftContext));
        },

        notBlockedContext: function (leftContext, propagate) {
            this.__addToLeftMemory(leftContext);
            propagate && this.__propagate("assert", this.__cloneContext(leftContext));
        },

        propagateFromLeft: function (leftContext) {
            this.notBlockedContext(leftContext, true);
        },

        propagateFromRight: function (leftContext) {
            this.notBlockedContext(leftContext, true);
        },

        blockFromAssertRight: function (leftContext, rightContext) {
            this.blockedContext(leftContext, rightContext, true);
        },

        blockFromAssertLeft: function (leftContext, rightContext) {
            this.blockedContext(leftContext, rightContext, false);
        },


        retractLeft: function (context) {
            var ctx = this.removeFromLeftMemory(context);
            if (ctx) {
                ctx = ctx.data;
                this.__propagate("retract", this.__cloneContext(ctx));
            } else {
                if (!this.removeFromLeftBlockedMemory(context)) {
                    throw new Error();
                }
            }
        },

        assertLeft: function (context) {
            var values = this.rightTuples.getRightMemory(context),
                thisConstraint = this.constraint, rc, i = -1, l = values.length;
            while (++i < l) {
                if (thisConstraint.isMatch(context, rc = values[i].data)) {
                    this.blockFromAssertLeft(context, rc);
                    context = null;
                    i = l;
                }
            }
            if (context) {
                this.propagateFromLeft(context);
            }
        },

        assertRight: function (context) {
            this.__addToRightMemory(context);
            context.blocking = new LinkedList();
            var fl = this.leftTuples.getLeftMemory(context).slice(),
                i = -1, l = fl.length,
                leftContext, thisConstraint = this.constraint;
            while (++i < l) {
                leftContext = fl[i].data;
                if (thisConstraint.isMatch(leftContext, context)) {
                    this.blockFromAssertRight(leftContext, context);
                }
            }
        },

        addToLeftBlockedMemory: function (context) {
            var data = context.data, hashCode = data.hashCode;
            var ctx = this.leftMemory[hashCode];
            this.leftTupleMemory[hashCode] = context;
            if (ctx) {
                this.leftTuples.remove(ctx);
            }
            return this;
        },

        removeFromLeftBlockedMemory: function (context) {
            var ret = this.leftTupleMemory[context.hashCode] || null;
            if (ret) {
                delete this.leftTupleMemory[context.hashCode];
                ret.data.blocker.blocking.remove(ret);
            }
            return ret;
        },

        modifyLeft: function (context) {
            var ctx = this.removeFromLeftMemory(context),
                leftContext,
                thisConstraint = this.constraint,
                rightTuples = this.rightTuples.getRightMemory(context),
                l = rightTuples.length,
                isBlocked = false,
                i, rc, blocker;
            if (!ctx) {
                //blocked before
                ctx = this.removeFromLeftBlockedMemory(context);
                isBlocked = true;
            }
            if (ctx) {
                leftContext = ctx.data;

                if (leftContext && leftContext.blocker) {
                    //we were blocked before so only check nodes previous to our blocker
                    blocker = this.rightMemory[leftContext.blocker.hashCode];
                    leftContext.blocker = null;
                }
                if (blocker) {
                    if (thisConstraint.isMatch(context, rc = blocker.data)) {
                        //we cant be proagated so retract previous
                        if (!isBlocked) {
                            //we were asserted before so retract
                            this.__propagate("retract", this.__cloneContext(leftContext));
                        }
                        context.blocker = rc;
                        this.addToLeftBlockedMemory(rc.blocking.push(context));
                        context = null;
                    }
                }
                if (context && l) {
                    i = -1;
                    //we were propogated before
                    while (++i < l) {
                        if (thisConstraint.isMatch(context, rc = rightTuples[i].data)) {
                            //we cant be proagated so retract previous
                            if (!isBlocked) {
                                //we were asserted before so retract
                                this.__propagate("retract", this.__cloneContext(leftContext));
                            }
                            this.addToLeftBlockedMemory(rc.blocking.push(context));
                            context.blocker = rc;
                            context = null;
                            break;
                        }
                    }
                }
                if (context) {
                    //we can still be propogated
                    this.__addToLeftMemory(context);
                    if (!isBlocked) {
                        //we weren't blocked before so modify
                        this.__propagate("modify", this.__cloneContext(context));
                    } else {
                        //we were blocked before but aren't now
                        this.__propagate("assert", this.__cloneContext(context));
                    }

                }
            } else {
                throw new Error();
            }

        },

        modifyRight: function (context) {
            var ctx = this.removeFromRightMemory(context);
            if (ctx) {
                var rightContext = ctx.data,
                    leftTuples = this.leftTuples.getLeftMemory(context).slice(),
                    leftTuplesLength = leftTuples.length,
                    leftContext,
                    thisConstraint = this.constraint,
                    i, node,
                    blocking = rightContext.blocking;
                this.__addToRightMemory(context);
                context.blocking = new LinkedList();

                var rc;
                //check old blocked contexts
                //check if the same contexts blocked before are still blocked
                var blockingNode = {next: blocking.head};
                while ((blockingNode = blockingNode.next)) {
                    leftContext = blockingNode.data;
                    leftContext.blocker = null;
                    if (thisConstraint.isMatch(leftContext, context)) {
                        leftContext.blocker = context;
                        this.addToLeftBlockedMemory(context.blocking.push(leftContext));
                        leftContext = null;
                    } else {
                        //we arent blocked anymore
                        leftContext.blocker = null;
                        node = ctx;
                        while ((node = node.next)) {
                            if (thisConstraint.isMatch(leftContext, rc = node.data)) {
                                leftContext.blocker = rc;
                                this.addToLeftBlockedMemory(rc.blocking.push(leftContext));
                                leftContext = null;
                                break;
                            }
                        }
                        if (leftContext) {
                            this.__addToLeftMemory(leftContext);
                            this.__propagate("assert", this.__cloneContext(leftContext));
                        }
                    }
                }
                if (leftTuplesLength) {
                    //check currently left tuples in memory
                    i = -1;
                    while (++i < leftTuplesLength) {
                        leftContext = leftTuples[i].data;
                        if (thisConstraint.isMatch(leftContext, context)) {
                            this.__propagate("retract", this.__cloneContext(leftContext));
                            this.removeFromLeftMemory(leftContext);
                            this.addToLeftBlockedMemory(context.blocking.push(leftContext));
                            leftContext.blocker = context;
                        }
                    }
                }
            } else {
                throw new Error();
            }


        }
    }
}).as(module);
},{"../context":10,"../linkedList":16,"../pattern":48,"./joinNode":28}],39:[function(require,module,exports){
var AlphaNode = require("./alphaNode"),
    Context = require("../context"),
    extd = require("../extended");

AlphaNode.extend({
    instance: {

        constructor: function () {
            this._super(arguments);
            this.alias = this.constraint.get("alias");
            this.varLength = (this.variables = extd(this.constraint.get("variables")).toArray().value()).length;
        },

        assert: function (context) {
            var c = new Context(context.fact, context.paths);
            var variables = this.variables, o = context.fact.object, item;
            c.set(this.alias, o);
            for (var i = 0, l = this.varLength; i < l; i++) {
                item = variables[i];
                c.set(item[1], o[item[0]]);
            }

            this.__propagate("assert", c);

        },

        retract: function (context) {
            this.__propagate("retract", new Context(context.fact, context.paths));
        },

        modify: function (context) {
            var c = new Context(context.fact, context.paths);
            var variables = this.variables, o = context.fact.object, item;
            c.set(this.alias, o);
            for (var i = 0, l = this.varLength; i < l; i++) {
                item = variables[i];
                c.set(item[1], o[item[0]]);
            }
            this.__propagate("modify", c);
        },


        toString: function () {
            return "PropertyNode" + this.__count;
        }
    }
}).as(module);



},{"../context":10,"../extended":12,"./alphaNode":20}],40:[function(require,module,exports){
var Node = require("./adapterNode");

Node.extend({
    instance: {

        retractResolve: function (match) {
            this.__propagate("retractResolve", match);
        },

        dispose: function (context) {
            this.propagateDispose(context);
        },

        propagateAssert: function (context) {
            this.__propagate("assertRight", context);
        },

        propagateRetract: function (context) {
            this.__propagate("retractRight", context);
        },

        propagateResolve: function (context) {
            this.__propagate("retractResolve", context);
        },

        propagateModify: function (context) {
            this.__propagate("modifyRight", context);
        },

        toString: function () {
            return "RightAdapterNode " + this.__count;
        }
    }
}).as(module);
},{"./adapterNode":18}],41:[function(require,module,exports){
var Node = require("./node"),
    extd = require("../extended"),
    bind = extd.bind;

Node.extend({
    instance: {
        constructor: function (bucket, index, rule, agenda) {
            this._super([]);
            this.resolve = bind(this, this.resolve);
            this.rule = rule;
            this.index = index;
            this.name = this.rule.name;
            this.agenda = agenda;
            this.bucket = bucket;
            agenda.register(this);
        },

        __assertModify: function (context) {
            var match = context.match;
            if (match.isMatch) {
                var rule = this.rule, bucket = this.bucket;
                this.agenda.insert(this, {
                    rule: rule,
                    hashCode: context.hashCode,
                    index: this.index,
                    name: rule.name,
                    recency: bucket.recency++,
                    match: match,
                    counter: bucket.counter
                });
            }
        },

        assert: function (context) {
            this.__assertModify(context);
        },

        modify: function (context) {
            this.agenda.retract(this, context);
            this.__assertModify(context);
        },

        retract: function (context) {
            this.agenda.retract(this, context);
        },

        retractRight: function (context) {
            this.agenda.retract(this, context);
        },

        retractLeft: function (context) {
            this.agenda.retract(this, context);
        },

        assertLeft: function (context) {
            this.__assertModify(context);
        },

        assertRight: function (context) {
            this.__assertModify(context);
        },

        toString: function () {
            return "TerminalNode " + this.rule.name;
        }
    }
}).as(module);
},{"../extended":12,"./node":37}],42:[function(require,module,exports){
var AlphaNode = require("./alphaNode"),
    Context = require("../context");

AlphaNode.extend({
    instance: {

        assert: function (fact) {
            if (this.constraintAssert(fact.object)) {
                this.__propagate("assert", fact);
            }
        },

        modify: function (fact) {
            if (this.constraintAssert(fact.object)) {
                this.__propagate("modify", fact);
            }
        },

        retract: function (fact) {
            if (this.constraintAssert(fact.object)) {
                this.__propagate("retract", fact);
            }
        },

        toString: function () {
            return "TypeNode" + this.__count;
        },

        dispose: function () {
            var es = this.__entrySet, i = es.length - 1;
            for (; i >= 0; i--) {
                var e = es[i], outNode = e.key, paths = e.value;
                outNode.dispose({paths: paths});
            }
        },

        __propagate: function (method, fact) {
            var es = this.__entrySet, i = -1, l = es.length;
            while (++i < l) {
                var e = es[i], outNode = e.key, paths = e.value;
                outNode[method](new Context(fact, paths));
            }
        }
    }
}).as(module);


},{"../context":10,"./alphaNode":20}],43:[function(require,module,exports){
var process=require("__browserify_process");/* parser generated by jison 0.4.13 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"EXPRESSION":4,"EOF":5,"UNARY_EXPRESSION":6,"LITERAL_EXPRESSION":7,"-":8,"!":9,"MULTIPLICATIVE_EXPRESSION":10,"*":11,"/":12,"%":13,"ADDITIVE_EXPRESSION":14,"+":15,"EXPONENT_EXPRESSION":16,"^":17,"RELATIONAL_EXPRESSION":18,"<":19,">":20,"<=":21,">=":22,"EQUALITY_EXPRESSION":23,"==":24,"===":25,"!=":26,"!==":27,"=~":28,"!=~":29,"IN_EXPRESSION":30,"in":31,"ARRAY_EXPRESSION":32,"notIn":33,"OBJECT_EXPRESSION":34,"AND_EXPRESSION":35,"&&":36,"OR_EXPRESSION":37,"||":38,"ARGUMENT_LIST":39,",":40,"IDENTIFIER_EXPRESSION":41,"IDENTIFIER":42,".":43,"[":44,"STRING_EXPRESSION":45,"]":46,"NUMBER_EXPRESSION":47,"(":48,")":49,"STRING":50,"NUMBER":51,"REGEXP_EXPRESSION":52,"REGEXP":53,"BOOLEAN_EXPRESSION":54,"BOOLEAN":55,"NULL_EXPRESSION":56,"NULL":57,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",8:"-",9:"!",11:"*",12:"/",13:"%",15:"+",17:"^",19:"<",20:">",21:"<=",22:">=",24:"==",25:"===",26:"!=",27:"!==",28:"=~",29:"!=~",31:"in",33:"notIn",36:"&&",38:"||",40:",",42:"IDENTIFIER",43:".",44:"[",46:"]",48:"(",49:")",50:"STRING",51:"NUMBER",53:"REGEXP",55:"BOOLEAN",57:"NULL"},
productions_: [0,[3,2],[6,1],[6,2],[6,2],[10,1],[10,3],[10,3],[10,3],[14,1],[14,3],[14,3],[16,1],[16,3],[18,1],[18,3],[18,3],[18,3],[18,3],[23,1],[23,3],[23,3],[23,3],[23,3],[23,3],[23,3],[30,1],[30,3],[30,3],[30,3],[30,3],[35,1],[35,3],[37,1],[37,3],[39,1],[39,3],[41,1],[34,1],[34,3],[34,4],[34,4],[34,4],[34,3],[34,4],[45,1],[47,1],[52,1],[54,1],[56,1],[32,2],[32,3],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,3],[4,1]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:return $$[$0-1];
break;
case 3:this.$ = [$$[$0], null, 'unary'];
break;
case 4:this.$ = [$$[$0], null, 'logicalNot'];
break;
case 6:this.$ = [$$[$0-2], $$[$0], 'mult'];
break;
case 7:this.$ = [$$[$0-2], $$[$0], 'div'];
break;
case 8:this.$ = [$$[$0-2], $$[$0], 'mod'];
break;
case 10:this.$ = [$$[$0-2], $$[$0], 'plus'];
break;
case 11:this.$ = [$$[$0-2], $$[$0], 'minus'];
break;
case 13:this.$ = [$$[$0-2], $$[$0], 'pow'];
break;
case 15:this.$ = [$$[$0-2], $$[$0], 'lt'];
break;
case 16:this.$ = [$$[$0-2], $$[$0], 'gt'];
break;
case 17:this.$ = [$$[$0-2], $$[$0], 'lte'];
break;
case 18:this.$ = [$$[$0-2], $$[$0], 'gte'];
break;
case 20:this.$ = [$$[$0-2], $$[$0], 'eq'];
break;
case 21:this.$ = [$$[$0-2], $$[$0], 'seq'];
break;
case 22:this.$ = [$$[$0-2], $$[$0], 'neq'];
break;
case 23:this.$ = [$$[$0-2], $$[$0], 'sneq'];
break;
case 24:this.$ = [$$[$0-2], $$[$0], 'like'];
break;
case 25:this.$ = [$$[$0-2], $$[$0], 'notLike'];
break;
case 27:this.$ = [$$[$0-2], $$[$0], 'in'];
break;
case 28:this.$ = [$$[$0-2], $$[$0], 'notIn'];
break;
case 29:this.$ = [$$[$0-2], $$[$0], 'in'];
break;
case 30:this.$ = [$$[$0-2], $$[$0], 'notIn'];
break;
case 32:this.$ = [$$[$0-2], $$[$0], 'and'];
break;
case 34:this.$ = [$$[$0-2], $$[$0], 'or'];
break;
case 36:this.$ = [$$[$0-2], $$[$0], 'arguments']
break;
case 37:this.$ = [String(yytext), null, 'identifier'];
break;
case 39:this.$ = [$$[$0-2],$$[$0], 'prop'];
break;
case 40:this.$ = [$$[$0-3],$$[$0-1], 'propLookup'];
break;
case 41:this.$ = [$$[$0-3],$$[$0-1], 'propLookup'];
break;
case 42:this.$ = [$$[$0-3],$$[$0-1], 'propLookup'];
break;
case 43:this.$ = [$$[$0-2], [null, null, 'arguments'], 'function']
break;
case 44:this.$ = [$$[$0-3], $$[$0-1], 'function']
break;
case 45:this.$ = [String(yytext.replace(/^['|"]|['|"]$/g, '')), null, 'string'];
break;
case 46:this.$ = [Number(yytext), null, 'number'];
break;
case 47:this.$ = [yytext, null, 'regexp'];
break;
case 48:this.$ = [yytext.replace(/^\s+/, '') == 'true', null, 'boolean'];
break;
case 49:this.$ = [null, null, 'null'];
break;
case 50:this.$ = [null, null, 'array'];
break;
case 51:this.$ = [$$[$0-1], null, 'array'];
break;
case 59:this.$ = [$$[$0-1], null, 'composite']
break;
}
},
table: [{3:1,4:2,6:28,7:7,8:[1,29],9:[1,30],10:27,14:25,16:17,18:8,23:6,30:5,32:15,34:14,35:4,37:3,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{1:[3]},{5:[1,31]},{5:[2,60],38:[1,32],49:[2,60]},{5:[2,33],36:[1,33],38:[2,33],49:[2,33]},{5:[2,31],36:[2,31],38:[2,31],49:[2,31]},{5:[2,26],24:[1,34],25:[1,35],26:[1,36],27:[1,37],28:[1,38],29:[1,39],36:[2,26],38:[2,26],49:[2,26]},{5:[2,2],8:[2,2],11:[2,2],12:[2,2],13:[2,2],15:[2,2],17:[2,2],19:[2,2],20:[2,2],21:[2,2],22:[2,2],24:[2,2],25:[2,2],26:[2,2],27:[2,2],28:[2,2],29:[2,2],31:[1,40],33:[1,41],36:[2,2],38:[2,2],49:[2,2]},{5:[2,19],19:[1,42],20:[1,43],21:[1,44],22:[1,45],24:[2,19],25:[2,19],26:[2,19],27:[2,19],28:[2,19],29:[2,19],36:[2,19],38:[2,19],49:[2,19]},{5:[2,52],8:[2,52],11:[2,52],12:[2,52],13:[2,52],15:[2,52],17:[2,52],19:[2,52],20:[2,52],21:[2,52],22:[2,52],24:[2,52],25:[2,52],26:[2,52],27:[2,52],28:[2,52],29:[2,52],31:[2,52],33:[2,52],36:[2,52],38:[2,52],40:[2,52],46:[2,52],49:[2,52]},{5:[2,53],8:[2,53],11:[2,53],12:[2,53],13:[2,53],15:[2,53],17:[2,53],19:[2,53],20:[2,53],21:[2,53],22:[2,53],24:[2,53],25:[2,53],26:[2,53],27:[2,53],28:[2,53],29:[2,53],31:[2,53],33:[2,53],36:[2,53],38:[2,53],40:[2,53],46:[2,53],49:[2,53]},{5:[2,54],8:[2,54],11:[2,54],12:[2,54],13:[2,54],15:[2,54],17:[2,54],19:[2,54],20:[2,54],21:[2,54],22:[2,54],24:[2,54],25:[2,54],26:[2,54],27:[2,54],28:[2,54],29:[2,54],31:[2,54],33:[2,54],36:[2,54],38:[2,54],40:[2,54],46:[2,54],49:[2,54]},{5:[2,55],8:[2,55],11:[2,55],12:[2,55],13:[2,55],15:[2,55],17:[2,55],19:[2,55],20:[2,55],21:[2,55],22:[2,55],24:[2,55],25:[2,55],26:[2,55],27:[2,55],28:[2,55],29:[2,55],31:[2,55],33:[2,55],36:[2,55],38:[2,55],40:[2,55],46:[2,55],49:[2,55]},{5:[2,56],8:[2,56],11:[2,56],12:[2,56],13:[2,56],15:[2,56],17:[2,56],19:[2,56],20:[2,56],21:[2,56],22:[2,56],24:[2,56],25:[2,56],26:[2,56],27:[2,56],28:[2,56],29:[2,56],31:[2,56],33:[2,56],36:[2,56],38:[2,56],40:[2,56],46:[2,56],49:[2,56]},{5:[2,57],8:[2,57],11:[2,57],12:[2,57],13:[2,57],15:[2,57],17:[2,57],19:[2,57],20:[2,57],21:[2,57],22:[2,57],24:[2,57],25:[2,57],26:[2,57],27:[2,57],28:[2,57],29:[2,57],31:[2,57],33:[2,57],36:[2,57],38:[2,57],40:[2,57],43:[1,46],44:[1,47],46:[2,57],48:[1,48],49:[2,57]},{5:[2,58],8:[2,58],11:[2,58],12:[2,58],13:[2,58],15:[2,58],17:[2,58],19:[2,58],20:[2,58],21:[2,58],22:[2,58],24:[2,58],25:[2,58],26:[2,58],27:[2,58],28:[2,58],29:[2,58],31:[2,58],33:[2,58],36:[2,58],38:[2,58],40:[2,58],46:[2,58],49:[2,58]},{4:49,6:28,7:7,8:[1,29],9:[1,30],10:27,14:25,16:17,18:8,23:6,30:5,32:15,34:14,35:4,37:3,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{5:[2,14],17:[1,50],19:[2,14],20:[2,14],21:[2,14],22:[2,14],24:[2,14],25:[2,14],26:[2,14],27:[2,14],28:[2,14],29:[2,14],36:[2,14],38:[2,14],49:[2,14]},{5:[2,45],8:[2,45],11:[2,45],12:[2,45],13:[2,45],15:[2,45],17:[2,45],19:[2,45],20:[2,45],21:[2,45],22:[2,45],24:[2,45],25:[2,45],26:[2,45],27:[2,45],28:[2,45],29:[2,45],31:[2,45],33:[2,45],36:[2,45],38:[2,45],40:[2,45],46:[2,45],49:[2,45]},{5:[2,46],8:[2,46],11:[2,46],12:[2,46],13:[2,46],15:[2,46],17:[2,46],19:[2,46],20:[2,46],21:[2,46],22:[2,46],24:[2,46],25:[2,46],26:[2,46],27:[2,46],28:[2,46],29:[2,46],31:[2,46],33:[2,46],36:[2,46],38:[2,46],40:[2,46],46:[2,46],49:[2,46]},{5:[2,47],8:[2,47],11:[2,47],12:[2,47],13:[2,47],15:[2,47],17:[2,47],19:[2,47],20:[2,47],21:[2,47],22:[2,47],24:[2,47],25:[2,47],26:[2,47],27:[2,47],28:[2,47],29:[2,47],31:[2,47],33:[2,47],36:[2,47],38:[2,47],40:[2,47],46:[2,47],49:[2,47]},{5:[2,48],8:[2,48],11:[2,48],12:[2,48],13:[2,48],15:[2,48],17:[2,48],19:[2,48],20:[2,48],21:[2,48],22:[2,48],24:[2,48],25:[2,48],26:[2,48],27:[2,48],28:[2,48],29:[2,48],31:[2,48],33:[2,48],36:[2,48],38:[2,48],40:[2,48],46:[2,48],49:[2,48]},{5:[2,49],8:[2,49],11:[2,49],12:[2,49],13:[2,49],15:[2,49],17:[2,49],19:[2,49],20:[2,49],21:[2,49],22:[2,49],24:[2,49],25:[2,49],26:[2,49],27:[2,49],28:[2,49],29:[2,49],31:[2,49],33:[2,49],36:[2,49],38:[2,49],40:[2,49],46:[2,49],49:[2,49]},{5:[2,38],8:[2,38],11:[2,38],12:[2,38],13:[2,38],15:[2,38],17:[2,38],19:[2,38],20:[2,38],21:[2,38],22:[2,38],24:[2,38],25:[2,38],26:[2,38],27:[2,38],28:[2,38],29:[2,38],31:[2,38],33:[2,38],36:[2,38],38:[2,38],40:[2,38],43:[2,38],44:[2,38],46:[2,38],48:[2,38],49:[2,38]},{7:53,32:15,34:14,39:52,41:23,42:[1,26],44:[1,24],45:9,46:[1,51],47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{5:[2,12],8:[1,55],15:[1,54],17:[2,12],19:[2,12],20:[2,12],21:[2,12],22:[2,12],24:[2,12],25:[2,12],26:[2,12],27:[2,12],28:[2,12],29:[2,12],36:[2,12],38:[2,12],49:[2,12]},{5:[2,37],8:[2,37],11:[2,37],12:[2,37],13:[2,37],15:[2,37],17:[2,37],19:[2,37],20:[2,37],21:[2,37],22:[2,37],24:[2,37],25:[2,37],26:[2,37],27:[2,37],28:[2,37],29:[2,37],31:[2,37],33:[2,37],36:[2,37],38:[2,37],40:[2,37],43:[2,37],44:[2,37],46:[2,37],48:[2,37],49:[2,37]},{5:[2,9],8:[2,9],11:[1,56],12:[1,57],13:[1,58],15:[2,9],17:[2,9],19:[2,9],20:[2,9],21:[2,9],22:[2,9],24:[2,9],25:[2,9],26:[2,9],27:[2,9],28:[2,9],29:[2,9],36:[2,9],38:[2,9],49:[2,9]},{5:[2,5],8:[2,5],11:[2,5],12:[2,5],13:[2,5],15:[2,5],17:[2,5],19:[2,5],20:[2,5],21:[2,5],22:[2,5],24:[2,5],25:[2,5],26:[2,5],27:[2,5],28:[2,5],29:[2,5],36:[2,5],38:[2,5],49:[2,5]},{6:59,7:60,8:[1,29],9:[1,30],32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:61,7:60,8:[1,29],9:[1,30],32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{1:[2,1]},{6:28,7:7,8:[1,29],9:[1,30],10:27,14:25,16:17,18:8,23:6,30:5,32:15,34:14,35:62,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:7,8:[1,29],9:[1,30],10:27,14:25,16:17,18:8,23:6,30:63,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:17,18:64,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:17,18:65,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:17,18:66,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:17,18:67,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:17,18:68,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:17,18:69,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{32:70,34:71,41:23,42:[1,26],44:[1,24]},{32:72,34:73,41:23,42:[1,26],44:[1,24]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:74,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:75,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:76,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:25,16:77,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{41:78,42:[1,26]},{34:81,41:23,42:[1,26],45:79,47:80,50:[1,18],51:[1,19]},{7:53,32:15,34:14,39:83,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],49:[1,82],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{49:[1,84]},{6:28,7:60,8:[1,29],9:[1,30],10:27,14:85,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{5:[2,50],8:[2,50],11:[2,50],12:[2,50],13:[2,50],15:[2,50],17:[2,50],19:[2,50],20:[2,50],21:[2,50],22:[2,50],24:[2,50],25:[2,50],26:[2,50],27:[2,50],28:[2,50],29:[2,50],31:[2,50],33:[2,50],36:[2,50],38:[2,50],40:[2,50],46:[2,50],49:[2,50]},{40:[1,87],46:[1,86]},{40:[2,35],46:[2,35],49:[2,35]},{6:28,7:60,8:[1,29],9:[1,30],10:88,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:28,7:60,8:[1,29],9:[1,30],10:89,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:90,7:60,8:[1,29],9:[1,30],32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:91,7:60,8:[1,29],9:[1,30],32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{6:92,7:60,8:[1,29],9:[1,30],32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{5:[2,3],8:[2,3],11:[2,3],12:[2,3],13:[2,3],15:[2,3],17:[2,3],19:[2,3],20:[2,3],21:[2,3],22:[2,3],24:[2,3],25:[2,3],26:[2,3],27:[2,3],28:[2,3],29:[2,3],36:[2,3],38:[2,3],49:[2,3]},{5:[2,2],8:[2,2],11:[2,2],12:[2,2],13:[2,2],15:[2,2],17:[2,2],19:[2,2],20:[2,2],21:[2,2],22:[2,2],24:[2,2],25:[2,2],26:[2,2],27:[2,2],28:[2,2],29:[2,2],36:[2,2],38:[2,2],49:[2,2]},{5:[2,4],8:[2,4],11:[2,4],12:[2,4],13:[2,4],15:[2,4],17:[2,4],19:[2,4],20:[2,4],21:[2,4],22:[2,4],24:[2,4],25:[2,4],26:[2,4],27:[2,4],28:[2,4],29:[2,4],36:[2,4],38:[2,4],49:[2,4]},{5:[2,34],36:[1,33],38:[2,34],49:[2,34]},{5:[2,32],36:[2,32],38:[2,32],49:[2,32]},{5:[2,20],19:[1,42],20:[1,43],21:[1,44],22:[1,45],24:[2,20],25:[2,20],26:[2,20],27:[2,20],28:[2,20],29:[2,20],36:[2,20],38:[2,20],49:[2,20]},{5:[2,21],19:[1,42],20:[1,43],21:[1,44],22:[1,45],24:[2,21],25:[2,21],26:[2,21],27:[2,21],28:[2,21],29:[2,21],36:[2,21],38:[2,21],49:[2,21]},{5:[2,22],19:[1,42],20:[1,43],21:[1,44],22:[1,45],24:[2,22],25:[2,22],26:[2,22],27:[2,22],28:[2,22],29:[2,22],36:[2,22],38:[2,22],49:[2,22]},{5:[2,23],19:[1,42],20:[1,43],21:[1,44],22:[1,45],24:[2,23],25:[2,23],26:[2,23],27:[2,23],28:[2,23],29:[2,23],36:[2,23],38:[2,23],49:[2,23]},{5:[2,24],19:[1,42],20:[1,43],21:[1,44],22:[1,45],24:[2,24],25:[2,24],26:[2,24],27:[2,24],28:[2,24],29:[2,24],36:[2,24],38:[2,24],49:[2,24]},{5:[2,25],19:[1,42],20:[1,43],21:[1,44],22:[1,45],24:[2,25],25:[2,25],26:[2,25],27:[2,25],28:[2,25],29:[2,25],36:[2,25],38:[2,25],49:[2,25]},{5:[2,27],36:[2,27],38:[2,27],49:[2,27]},{5:[2,29],36:[2,29],38:[2,29],43:[1,46],44:[1,47],48:[1,48],49:[2,29]},{5:[2,28],36:[2,28],38:[2,28],49:[2,28]},{5:[2,30],36:[2,30],38:[2,30],43:[1,46],44:[1,47],48:[1,48],49:[2,30]},{5:[2,15],17:[1,50],19:[2,15],20:[2,15],21:[2,15],22:[2,15],24:[2,15],25:[2,15],26:[2,15],27:[2,15],28:[2,15],29:[2,15],36:[2,15],38:[2,15],49:[2,15]},{5:[2,16],17:[1,50],19:[2,16],20:[2,16],21:[2,16],22:[2,16],24:[2,16],25:[2,16],26:[2,16],27:[2,16],28:[2,16],29:[2,16],36:[2,16],38:[2,16],49:[2,16]},{5:[2,17],17:[1,50],19:[2,17],20:[2,17],21:[2,17],22:[2,17],24:[2,17],25:[2,17],26:[2,17],27:[2,17],28:[2,17],29:[2,17],36:[2,17],38:[2,17],49:[2,17]},{5:[2,18],17:[1,50],19:[2,18],20:[2,18],21:[2,18],22:[2,18],24:[2,18],25:[2,18],26:[2,18],27:[2,18],28:[2,18],29:[2,18],36:[2,18],38:[2,18],49:[2,18]},{5:[2,39],8:[2,39],11:[2,39],12:[2,39],13:[2,39],15:[2,39],17:[2,39],19:[2,39],20:[2,39],21:[2,39],22:[2,39],24:[2,39],25:[2,39],26:[2,39],27:[2,39],28:[2,39],29:[2,39],31:[2,39],33:[2,39],36:[2,39],38:[2,39],40:[2,39],43:[2,39],44:[2,39],46:[2,39],48:[2,39],49:[2,39]},{46:[1,93]},{46:[1,94]},{43:[1,46],44:[1,47],46:[1,95],48:[1,48]},{5:[2,43],8:[2,43],11:[2,43],12:[2,43],13:[2,43],15:[2,43],17:[2,43],19:[2,43],20:[2,43],21:[2,43],22:[2,43],24:[2,43],25:[2,43],26:[2,43],27:[2,43],28:[2,43],29:[2,43],31:[2,43],33:[2,43],36:[2,43],38:[2,43],40:[2,43],43:[2,43],44:[2,43],46:[2,43],48:[2,43],49:[2,43]},{40:[1,87],49:[1,96]},{5:[2,59],8:[2,59],11:[2,59],12:[2,59],13:[2,59],15:[2,59],17:[2,59],19:[2,59],20:[2,59],21:[2,59],22:[2,59],24:[2,59],25:[2,59],26:[2,59],27:[2,59],28:[2,59],29:[2,59],31:[2,59],33:[2,59],36:[2,59],38:[2,59],40:[2,59],46:[2,59],49:[2,59]},{5:[2,13],8:[1,55],15:[1,54],17:[2,13],19:[2,13],20:[2,13],21:[2,13],22:[2,13],24:[2,13],25:[2,13],26:[2,13],27:[2,13],28:[2,13],29:[2,13],36:[2,13],38:[2,13],49:[2,13]},{5:[2,51],8:[2,51],11:[2,51],12:[2,51],13:[2,51],15:[2,51],17:[2,51],19:[2,51],20:[2,51],21:[2,51],22:[2,51],24:[2,51],25:[2,51],26:[2,51],27:[2,51],28:[2,51],29:[2,51],31:[2,51],33:[2,51],36:[2,51],38:[2,51],40:[2,51],46:[2,51],49:[2,51]},{7:97,32:15,34:14,41:23,42:[1,26],44:[1,24],45:9,47:10,48:[1,16],50:[1,18],51:[1,19],52:11,53:[1,20],54:12,55:[1,21],56:13,57:[1,22]},{5:[2,10],8:[2,10],11:[1,56],12:[1,57],13:[1,58],15:[2,10],17:[2,10],19:[2,10],20:[2,10],21:[2,10],22:[2,10],24:[2,10],25:[2,10],26:[2,10],27:[2,10],28:[2,10],29:[2,10],36:[2,10],38:[2,10],49:[2,10]},{5:[2,11],8:[2,11],11:[1,56],12:[1,57],13:[1,58],15:[2,11],17:[2,11],19:[2,11],20:[2,11],21:[2,11],22:[2,11],24:[2,11],25:[2,11],26:[2,11],27:[2,11],28:[2,11],29:[2,11],36:[2,11],38:[2,11],49:[2,11]},{5:[2,6],8:[2,6],11:[2,6],12:[2,6],13:[2,6],15:[2,6],17:[2,6],19:[2,6],20:[2,6],21:[2,6],22:[2,6],24:[2,6],25:[2,6],26:[2,6],27:[2,6],28:[2,6],29:[2,6],36:[2,6],38:[2,6],49:[2,6]},{5:[2,7],8:[2,7],11:[2,7],12:[2,7],13:[2,7],15:[2,7],17:[2,7],19:[2,7],20:[2,7],21:[2,7],22:[2,7],24:[2,7],25:[2,7],26:[2,7],27:[2,7],28:[2,7],29:[2,7],36:[2,7],38:[2,7],49:[2,7]},{5:[2,8],8:[2,8],11:[2,8],12:[2,8],13:[2,8],15:[2,8],17:[2,8],19:[2,8],20:[2,8],21:[2,8],22:[2,8],24:[2,8],25:[2,8],26:[2,8],27:[2,8],28:[2,8],29:[2,8],36:[2,8],38:[2,8],49:[2,8]},{5:[2,40],8:[2,40],11:[2,40],12:[2,40],13:[2,40],15:[2,40],17:[2,40],19:[2,40],20:[2,40],21:[2,40],22:[2,40],24:[2,40],25:[2,40],26:[2,40],27:[2,40],28:[2,40],29:[2,40],31:[2,40],33:[2,40],36:[2,40],38:[2,40],40:[2,40],43:[2,40],44:[2,40],46:[2,40],48:[2,40],49:[2,40]},{5:[2,41],8:[2,41],11:[2,41],12:[2,41],13:[2,41],15:[2,41],17:[2,41],19:[2,41],20:[2,41],21:[2,41],22:[2,41],24:[2,41],25:[2,41],26:[2,41],27:[2,41],28:[2,41],29:[2,41],31:[2,41],33:[2,41],36:[2,41],38:[2,41],40:[2,41],43:[2,41],44:[2,41],46:[2,41],48:[2,41],49:[2,41]},{5:[2,42],8:[2,42],11:[2,42],12:[2,42],13:[2,42],15:[2,42],17:[2,42],19:[2,42],20:[2,42],21:[2,42],22:[2,42],24:[2,42],25:[2,42],26:[2,42],27:[2,42],28:[2,42],29:[2,42],31:[2,42],33:[2,42],36:[2,42],38:[2,42],40:[2,42],43:[2,42],44:[2,42],46:[2,42],48:[2,42],49:[2,42]},{5:[2,44],8:[2,44],11:[2,44],12:[2,44],13:[2,44],15:[2,44],17:[2,44],19:[2,44],20:[2,44],21:[2,44],22:[2,44],24:[2,44],25:[2,44],26:[2,44],27:[2,44],28:[2,44],29:[2,44],31:[2,44],33:[2,44],36:[2,44],38:[2,44],40:[2,44],43:[2,44],44:[2,44],46:[2,44],48:[2,44],49:[2,44]},{40:[2,36],46:[2,36],49:[2,36]}],
defaultActions: {31:[2,1]},
parseError: function parseError(str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        throw new Error(str);
    }
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    this.yy.parser = this;
    if (typeof this.lexer.yylloc == 'undefined') {
        this.lexer.yylloc = {};
    }
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    var ranges = this.lexer.options && this.lexer.options.ranges;
    if (typeof this.yy.parseError === 'function') {
        this.parseError = this.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || EOF;
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + this.lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: this.lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: this.lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                this.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};
/* generated by jison-lex 0.2.1 */
var lexer = (function(){
var lexer = {

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input) {
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len - 1);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function (match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex() {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState() {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules() {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState(n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState(condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:return 31;
break;
case 1:return 33;
break;
case 2:return 'from';
break;
case 3:return 24;
break;
case 4:return 25;
break;
case 5:return 26;
break;
case 6:return 27;
break;
case 7:return 21;
break;
case 8:return 19;
break;
case 9:return 22;
break;
case 10:return 20;
break;
case 11:return 28;
break;
case 12:return 29;
break;
case 13:return 36;
break;
case 14:return 38;
break;
case 15:return 57;
break;
case 16:return 55;
break;
case 17:/* skip whitespace */
break;
case 18:return 51;
break;
case 19:return 50;
break;
case 20:return 50;
break;
case 21:return 42;
break;
case 22:return 53;
break;
case 23:return 43;
break;
case 24:return 11;
break;
case 25:return 12;
break;
case 26:return 13;
break;
case 27:return 40;
break;
case 28:return 8;
break;
case 29:return 28;
break;
case 30:return 29;
break;
case 31:return 25;
break;
case 32:return 24;
break;
case 33:return 27;
break;
case 34:return 26;
break;
case 35:return 21;
break;
case 36:return 22;
break;
case 37:return 20;
break;
case 38:return 19;
break;
case 39:return 36;
break;
case 40:return 38;
break;
case 41:return 15;
break;
case 42:return 17;
break;
case 43:return 48;
break;
case 44:return 46;
break;
case 45:return 44;
break;
case 46:return 49;
break;
case 47:return 9;
break;
case 48:return 5;
break;
}
},
rules: [/^(?:\s+in\b)/,/^(?:\s+notIn\b)/,/^(?:\s+from\b)/,/^(?:\s+(eq|EQ)\b)/,/^(?:\s+(seq|SEQ)\b)/,/^(?:\s+(neq|NEQ)\b)/,/^(?:\s+(sneq|SNEQ)\b)/,/^(?:\s+(lte|LTE)\b)/,/^(?:\s+(lt|LT)\b)/,/^(?:\s+(gte|GTE)\b)/,/^(?:\s+(gt|GT)\b)/,/^(?:\s+(like|LIKE)\b)/,/^(?:\s+(notLike|NOT_LIKE)\b)/,/^(?:\s+(and|AND)\b)/,/^(?:\s+(or|OR)\b)/,/^(?:\s+null\b)/,/^(?:\s+(true|false)\b)/,/^(?:\s+)/,/^(?:-?[0-9]+(?:\.[0-9]+)?\b)/,/^(?:'[^']*')/,/^(?:"[^"]*")/,/^(?:([a-zA-Z_$][0-9a-zA-Z_$]*))/,/^(?:^\/((?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/[imgy]{0,4})(?!\w))/,/^(?:\.)/,/^(?:\*)/,/^(?:\/)/,/^(?:\%)/,/^(?:,)/,/^(?:-)/,/^(?:=~)/,/^(?:!=~)/,/^(?:===)/,/^(?:==)/,/^(?:!==)/,/^(?:!=)/,/^(?:<=)/,/^(?:>=)/,/^(?:>)/,/^(?:<)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:\+)/,/^(?:\^)/,/^(?:\()/,/^(?:\])/,/^(?:\[)/,/^(?:\))/,/^(?:!)/,/^(?:$)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48],"inclusive":true}}
};
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.Parser = parser.Parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); };
exports.main = function commonjsMain(args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
},{"__browserify_process":64,"fs":61,"path":62}],44:[function(require,module,exports){
(function () {
    "use strict";
    var constraintParser = require("./constraint/parser"),
        noolParser = require("./nools/nool.parser");

    exports.parseConstraint = function (expression) {
        try {
            return constraintParser.parse(expression);
        } catch (e) {
            throw new Error("Invalid expression '" + expression + "'");
        }
    };

    exports.parseRuleSet = function (source, file) {
        return noolParser.parse(source, file);
    };
})();
},{"./constraint/parser":43,"./nools/nool.parser":45}],45:[function(require,module,exports){
"use strict";

var tokens = require("./tokens.js"),
    extd = require("../../extended"),
    keys = extd.hash.keys,
    utils = require("./util.js");

var parse = function (src, keywords, context) {
    var orig = src;
    src = src.replace(/\/\/(.*)/g, "").replace(/\n|\r|\r\n/g, " ");

    var blockTypes = new RegExp("^(" + keys(keywords).join("|") + ")"), index;
    while (src && (index = utils.findNextTokenIndex(src)) !== -1) {
        src = src.substr(index);
        var blockType = src.match(blockTypes);
        if (blockType !== null) {
            blockType = blockType[1];
            if (blockType in keywords) {
                try {
                    src = keywords[blockType](src, context, parse).replace(/^\s*|\s*$/g, "");
                } catch (e) {
                    throw new Error("Invalid " + blockType + " definition \n" + e.message + "; \nstarting at : " + orig);
                }
            } else {
                throw new Error("Unknown token" + blockType);
            }
        } else {
            throw new Error("Error parsing " + src);
        }
    }
};

exports.parse = function (src, file) {
    var context = {define: [], rules: [], scope: [], loaded: [], file: file};
    parse(src, tokens, context);
    return context;
};


},{"../../extended":12,"./tokens.js":46,"./util.js":47}],46:[function(require,module,exports){
var process=require("__browserify_process");"use strict";

var utils = require("./util.js"),
    fs = require("fs"),
    extd = require("../../extended"),
    filter = extd.filter,
    indexOf = extd.indexOf,
    predicates = ["not", "or", "exists"],
    predicateRegExp = new RegExp("^(" + predicates.join("|") + ") *\\((.*)\\)$", "m"),
    predicateBeginExp = new RegExp(" *(" + predicates.join("|") + ") *\\(", "g");

var isWhiteSpace = function (str) {
    return str.replace(/[\s|\n|\r|\t]/g, "").length === 0;
};

var joinFunc = function (m, str) {
    return "; " + str;
};

var splitRuleLineByPredicateExpressions = function (ruleLine) {
    var str = ruleLine.replace(/,\s*(\$?\w+\s*:)/g, joinFunc);
    var parts = filter(str.split(predicateBeginExp), function (str) {
            return str !== "";
        }),
        l = parts.length, ret = [];

    if (l) {
        for (var i = 0; i < l; i++) {
            if (indexOf(predicates, parts[i]) !== -1) {
                ret.push([parts[i], "(", parts[++i].replace(/, *$/, "")].join(""));
            } else {
                ret.push(parts[i].replace(/, *$/, ""));
            }
        }
    } else {
        return str;
    }
    return ret.join(";");
};

var ruleTokens = {

    salience: (function () {
        var salienceRegexp = /^(salience|priority)\s*:\s*(-?\d+)\s*[,;]?/;
        return function (src, context) {
            if (salienceRegexp.test(src)) {
                var parts = src.match(salienceRegexp),
                    priority = parseInt(parts[2], 10);
                if (!isNaN(priority)) {
                    context.options.priority = priority;
                } else {
                    throw new Error("Invalid salience/priority " + parts[2]);
                }
                return src.replace(parts[0], "");
            } else {
                throw new Error("invalid format");
            }
        };
    })(),

    agendaGroup: (function () {
        var agendaGroupRegexp = /^(agenda-group|agendaGroup)\s*:\s*([a-zA-Z_$][0-9a-zA-Z_$]*|"[^"]*"|'[^']*')\s*[,;]?/;
        return function (src, context) {
            if (agendaGroupRegexp.test(src)) {
                var parts = src.match(agendaGroupRegexp),
                    agendaGroup = parts[2];
                if (agendaGroup) {
                    context.options.agendaGroup = agendaGroup.replace(/^["']|["']$/g, "");
                } else {
                    throw new Error("Invalid agenda-group " + parts[2]);
                }
                return src.replace(parts[0], "");
            } else {
                throw new Error("invalid format");
            }
        };
    })(),

    autoFocus: (function () {
        var autoFocusRegexp = /^(auto-focus|autoFocus)\s*:\s*(true|false)\s*[,;]?/;
        return function (src, context) {
            if (autoFocusRegexp.test(src)) {
                var parts = src.match(autoFocusRegexp),
                    autoFocus = parts[2];
                if (autoFocus) {
                    context.options.autoFocus = autoFocus === "true" ? true : false;
                } else {
                    throw new Error("Invalid auto-focus " + parts[2]);
                }
                return src.replace(parts[0], "");
            } else {
                throw new Error("invalid format");
            }
        };
    })(),

    "agenda-group": function () {
        return this.agendaGroup.apply(this, arguments);
    },

    "auto-focus": function () {
        return this.autoFocus.apply(this, arguments);
    },

    priority: function () {
        return this.salience.apply(this, arguments);
    },

    when: (function () {
        /*jshint evil:true*/

        var ruleRegExp = /^(\$?\w+) *: *(\w+)(.*)/;

        var constraintRegExp = /(\{ *(?:["']?\$?\w+["']?\s*:\s*["']?\$?\w+["']? *(?:, *["']?\$?\w+["']?\s*:\s*["']?\$?\w+["']?)*)+ *\})/;
        var fromRegExp = /(\bfrom\s+.*)/;
        var parseRules = function (str) {
            var rules = [];
            var ruleLines = str.split(";"), l = ruleLines.length, ruleLine;
            for (var i = 0; i < l && (ruleLine = ruleLines[i].replace(/^\s*|\s*$/g, "").replace(/\n/g, "")); i++) {
                if (!isWhiteSpace(ruleLine)) {
                    var rule = [];
                    if (predicateRegExp.test(ruleLine)) {
                        var m = ruleLine.match(predicateRegExp);
                        var pred = m[1].replace(/^\s*|\s*$/g, "");
                        rule.push(pred);
                        ruleLine = m[2].replace(/^\s*|\s*$/g, "");
                        if (pred === "or") {
                            rule = rule.concat(parseRules(splitRuleLineByPredicateExpressions(ruleLine)));
                            rules.push(rule);
                            continue;
                        }

                    }
                    var parts = ruleLine.match(ruleRegExp);
                    if (parts && parts.length) {
                        rule.push(parts[2], parts[1]);
                        var constraints = parts[3].replace(/^\s*|\s*$/g, "");
                        var hashParts = constraints.match(constraintRegExp), from = null, fromMatch;
                        if (hashParts) {
                            var hash = hashParts[1], constraint = constraints.replace(hash, "");
                            if (fromRegExp.test(constraint)) {
                                fromMatch = constraint.match(fromRegExp);
                                from = fromMatch[0];
                                constraint = constraint.replace(fromMatch[0], "");
                            }
                            if (constraint) {
                                rule.push(constraint.replace(/^\s*|\s*$/g, ""));
                            }
                            if (hash) {
                                rule.push(eval("(" + hash.replace(/(\$?\w+)\s*:\s*(\$?\w+)/g, '"$1" : "$2"') + ")"));
                            }
                        } else if (constraints && !isWhiteSpace(constraints)) {
                            if (fromRegExp.test(constraints)) {
                                fromMatch = constraints.match(fromRegExp);
                                from = fromMatch[0];
                                constraints = constraints.replace(fromMatch[0], "");
                            }
                            rule.push(constraints);
                        }
                        if (from) {
                            rule.push(from);
                        }
                        rules.push(rule);
                    } else {
                        throw new Error("Invalid constraint " + ruleLine);
                    }
                }
            }
            return rules;
        };

        return function (orig, context) {
            var src = orig.replace(/^when\s*/, "").replace(/^\s*|\s*$/g, "");
            if (utils.findNextToken(src) === "{") {
                var body = utils.getTokensBetween(src, "{", "}", true).join("");
                src = src.replace(body, "");
                context.constraints = parseRules(body.replace(/^\{\s*|\}\s*$/g, ""));
                return src;
            } else {
                throw new Error("unexpected token : expected : '{' found : '" + utils.findNextToken(src) + "'");
            }
        };
    })(),

    then: (function () {
        return function (orig, context) {
            if (!context.action) {
                var src = orig.replace(/^then\s*/, "").replace(/^\s*|\s*$/g, "");
                if (utils.findNextToken(src) === "{") {
                    var body = utils.getTokensBetween(src, "{", "}", true).join("");
                    src = src.replace(body, "");
                    if (!context.action) {
                        context.action = body.replace(/^\{\s*|\}\s*$/g, "");
                    }
                    if (!isWhiteSpace(src)) {
                        throw new Error("Error parsing then block " + orig);
                    }
                    return src;
                } else {
                    throw new Error("unexpected token : expected : '{' found : '" + utils.findNextToken(src) + "'");
                }
            } else {
                throw new Error("action already defined for rule" + context.name);
            }

        };
    })()
};

var topLevelTokens = {
    "/": function (orig) {
        if (orig.match(/^\/\*/)) {
            // Block Comment parse
            return orig.replace(/\/\*.*?\*\//, "");
        } else {
            return orig;
        }
    },

    "define": function (orig, context) {
        var src = orig.replace(/^define\s*/, "");
        var name = src.match(/^([a-zA-Z_$][0-9a-zA-Z_$]*)/);
        if (name) {
            src = src.replace(name[0], "").replace(/^\s*|\s*$/g, "");
            if (utils.findNextToken(src) === "{") {
                name = name[1];
                var body = utils.getTokensBetween(src, "{", "}", true).join("");
                src = src.replace(body, "");
                //should
                context.define.push({name: name, properties: "(" + body + ")"});
                return src;
            } else {
                throw new Error("unexpected token : expected : '{' found : '" + utils.findNextToken(src) + "'");
            }
        } else {
            throw new Error("missing name");
        }
    },

    "import": function (orig, context, parse) {
        if (typeof window !== 'undefined') {
            throw new Error("import cannot be used in a browser");
        }
        var src = orig.replace(/^import\s*/, "");
        if (utils.findNextToken(src) === "(") {
            var file = utils.getParamList(src);
            src = src.replace(file, "").replace(/^\s*|\s*$/g, "");
            utils.findNextToken(src) === ";" && (src = src.replace(/\s*;/, ""));
            file = file.replace(/[\(|\)]/g, "").split(",");
            if (file.length === 1) {
                file = utils.resolve(context.file || process.cwd(), file[0].replace(/["|']/g, ""));
                if (indexOf(context.loaded, file) === -1) {
                    var origFile = context.file;
                    context.file = file;
                    parse(fs.readFileSync(file, "utf8"), topLevelTokens, context);
                    context.loaded.push(file);
                    context.file = origFile;
                }
                return src;
            } else {
                throw new Error("import accepts a single file");
            }
        } else {
            throw new Error("unexpected token : expected : '(' found : '" + utils.findNextToken(src) + "'");
        }

    },

    //define a global
    "global": function (orig, context) {
        var src = orig.replace(/^global\s*/, "");
        var name = src.match(/^([a-zA-Z_$][0-9a-zA-Z_$]*\s*)/);
        if (name) {
            src = src.replace(name[0], "").replace(/^\s*|\s*$/g, "");
            if (utils.findNextToken(src) === "=") {
                name = name[1].replace(/^\s+|\s+$/g, '');
                var fullbody = utils.getTokensBetween(src, "=", ";", true).join("");
                var body = fullbody.substring(1, fullbody.length - 1);
                body = body.replace(/^\s+|\s+$/g, '');
                if (/^require\(/.test(body)) {
                    var file = utils.getParamList(body.replace("require")).replace(/[\(|\)]/g, "").split(",");
                    if (file.length === 1) {
                        //handle relative require calls
                        file = file[0].replace(/["|']/g, "");
                        body = ["require('", utils.resolve(context.file || process.cwd(), file) , "')"].join("");
                    }
                }
                context.scope.push({name: name, body: body});
                src = src.replace(fullbody, "");
                return src;
            } else {
                throw new Error("unexpected token : expected : '=' found : '" + utils.findNextToken(src) + "'");
            }
        } else {
            throw new Error("missing name");
        }
    },

    //define a function
    "function": function (orig, context) {
        var src = orig.replace(/^function\s*/, "");
        //parse the function name
        var name = src.match(/^([a-zA-Z_$][0-9a-zA-Z_$]*)\s*/);
        if (name) {
            src = src.replace(name[0], "");
            if (utils.findNextToken(src) === "(") {
                name = name[1];
                var params = utils.getParamList(src);
                src = src.replace(params, "").replace(/^\s*|\s*$/g, "");
                if (utils.findNextToken(src) === "{") {
                    var body = utils.getTokensBetween(src, "{", "}", true).join("");
                    src = src.replace(body, "");
                    //should
                    context.scope.push({name: name, body: "function" + params + body});
                    return src;
                } else {
                    throw new Error("unexpected token : expected : '{' found : '" + utils.findNextToken(src) + "'");
                }
            } else {
                throw new Error("unexpected token : expected : '(' found : '" + utils.findNextToken(src) + "'");
            }
        } else {
            throw new Error("missing name");
        }
    },

    "rule": function (orig, context, parse) {
        var src = orig.replace(/^rule\s*/, "");
        var name = src.match(/^([a-zA-Z_$][0-9a-zA-Z_$]*|"[^"]*"|'[^']*')/);
        if (name) {
            src = src.replace(name[0], "").replace(/^\s*|\s*$/g, "");
            if (utils.findNextToken(src) === "{") {
                name = name[1].replace(/^["']|["']$/g, "");
                var rule = {name: name, options: {}, constraints: null, action: null};
                var body = utils.getTokensBetween(src, "{", "}", true).join("");
                src = src.replace(body, "");
                parse(body.replace(/^\{\s*|\}\s*$/g, ""), ruleTokens, rule);
                context.rules.push(rule);
                return src;
            } else {
                throw new Error("unexpected token : expected : '{' found : '" + utils.findNextToken(src) + "'");
            }
        } else {
            throw new Error("missing name");
        }

    }
};
module.exports = topLevelTokens;


},{"../../extended":12,"./util.js":47,"__browserify_process":64,"fs":61}],47:[function(require,module,exports){
var process=require("__browserify_process");"use strict";

var path = require("path");
var WHITE_SPACE_REG = /[\s|\n|\r|\t]/,
    pathSep = path.sep || ( process.platform === 'win32' ? '\\' : '/' );

var TOKEN_INVERTS = {
    "{": "}",
    "}": "{",
    "(": ")",
    ")": "(",
    "[": "]"
};

var getTokensBetween = exports.getTokensBetween = function (str, start, stop, includeStartEnd) {
    var depth = 0, ret = [];
    if (!start) {
        start = TOKEN_INVERTS[stop];
        depth = 1;
    }
    if (!stop) {
        stop = TOKEN_INVERTS[start];
    }
    str = Object(str);
    var startPushing = false, token, cursor = 0, found = false;
    while ((token = str.charAt(cursor++))) {
        if (token === start) {
            depth++;
            if (!startPushing) {
                startPushing = true;
                if (includeStartEnd) {
                    ret.push(token);
                }
            } else {
                ret.push(token);
            }
        } else if (token === stop && cursor) {
            depth--;
            if (depth === 0) {
                if (includeStartEnd) {
                    ret.push(token);
                }
                found = true;
                break;
            }
            ret.push(token);
        } else if (startPushing) {
            ret.push(token);
        }
    }
    if (!found) {
        throw new Error("Unable to match " + start + " in " + str);
    }
    return ret;
};

exports.getParamList = function (str) {
    return  getTokensBetween(str, "(", ")", true).join("");
};

exports.resolve = function (from, to) {
    if (path.extname(from) !== '') {
        from = path.dirname(from);
    }
    if (to.split(pathSep).length === 1) {
        return to;
    }
    return path.resolve(from, to);

};

var findNextTokenIndex = exports.findNextTokenIndex = function (str, startIndex, endIndex) {
    startIndex = startIndex || 0;
    endIndex = endIndex || str.length;
    var ret = -1, l = str.length;
    if (!endIndex || endIndex > l) {
        endIndex = l;
    }
    for (; startIndex < endIndex; startIndex++) {
        var c = str.charAt(startIndex);
        if (!WHITE_SPACE_REG.test(c)) {
            ret = startIndex;
            break;
        }
    }
    return ret;
};

exports.findNextToken = function (str, startIndex, endIndex) {
    return str.charAt(findNextTokenIndex(str, startIndex, endIndex));
};
},{"__browserify_process":64,"path":62}],48:[function(require,module,exports){
"use strict";
var extd = require("./extended"),
    isEmpty = extd.isEmpty,
    merge = extd.merge,
    forEach = extd.forEach,
    declare = extd.declare,
    constraintMatcher = require("./constraintMatcher"),
    constraint = require("./constraint"),
    EqualityConstraint = constraint.EqualityConstraint,
    FromConstraint = constraint.FromConstraint;

var id = 0;
var Pattern = declare({});

var ObjectPattern = Pattern.extend({
    instance: {
        constructor: function (type, alias, conditions, store, options) {
            options = options || {};
            this.id = id++;
            this.type = type;
            this.alias = alias;
            this.conditions = conditions;
            this.pattern = options.pattern;
            var constraints = [new constraint.ObjectConstraint(type)];
            var constrnts = constraintMatcher.toConstraints(conditions, merge({alias: alias}, options));
            if (constrnts.length) {
                constraints = constraints.concat(constrnts);
            } else {
                var cnstrnt = new constraint.TrueConstraint();
                constraints.push(cnstrnt);
            }
            if (store && !isEmpty(store)) {
                var atm = new constraint.HashConstraint(store);
                constraints.push(atm);
            }

            forEach(constraints, function (constraint) {
                constraint.set("alias", alias);
            });
            this.constraints = constraints;
        },

        getSpecificity: function () {
            var constraints = this.constraints, specificity = 0;
            for (var i = 0, l = constraints.length; i < l; i++) {
                if (constraints[i] instanceof EqualityConstraint) {
                    specificity++;
                }
            }
            return specificity;
        },

        hasConstraint: function (type) {
            return extd.some(this.constraints, function (c) {
                return c instanceof type;
            });
        },

        hashCode: function () {
            return [this.type, this.alias, extd.format("%j", this.conditions)].join(":");
        },

        toString: function () {
            return extd.format("%j", this.constraints);
        }
    }
}).as(exports, "ObjectPattern");

var FromPattern = ObjectPattern.extend({
    instance: {
        constructor: function (type, alias, conditions, store, from, options) {
            this._super([type, alias, conditions, store, options]);
            this.from = new FromConstraint(from, options);
        },

        hasConstraint: function (type) {
            return extd.some(this.constraints, function (c) {
                return c instanceof type;
            });
        },

        getSpecificity: function () {
            return this._super(arguments) + 1;
        },

        hashCode: function () {
            return [this.type, this.alias, extd.format("%j", this.conditions), this.from.from].join(":");
        },

        toString: function () {
            return extd.format("%j from %s", this.constraints, this.from.from);
        }
    }
}).as(exports, "FromPattern");


FromPattern.extend().as(exports, "FromNotPattern");
ObjectPattern.extend().as(exports, "NotPattern");
ObjectPattern.extend().as(exports, "ExistsPattern");
FromPattern.extend().as(exports, "FromExistsPattern");

Pattern.extend({

    instance: {
        constructor: function (left, right) {
            this.id = id++;
            this.leftPattern = left;
            this.rightPattern = right;
        },

        hashCode: function () {
            return [this.leftPattern.hashCode(), this.rightPattern.hashCode()].join(":");
        },

        getSpecificity: function () {
            return this.rightPattern.getSpecificity() + this.leftPattern.getSpecificity();
        },

        getters: {
            constraints: function () {
                return this.leftPattern.constraints.concat(this.rightPattern.constraints);
            }
        }
    }

}).as(exports, "CompositePattern");


var InitialFact = declare({
    instance: {
        constructor: function () {
            this.id = id++;
            this.recency = 0;
        }
    }
}).as(exports, "InitialFact");

ObjectPattern.extend({
    instance: {
        constructor: function () {
            this._super([InitialFact, "__i__", [], {}]);
        },

        assert: function () {
            return true;
        }
    }
}).as(exports, "InitialFactPattern");




},{"./constraint":8,"./constraintMatcher":9,"./extended":12}],49:[function(require,module,exports){
"use strict";
var extd = require("./extended"),
    isArray = extd.isArray,
    Promise = extd.Promise,
    declare = extd.declare,
    isHash = extd.isHash,
    isString = extd.isString,
    format = extd.format,
    parser = require("./parser"),
    pattern = require("./pattern"),
    ObjectPattern = pattern.ObjectPattern,
    FromPattern = pattern.FromPattern,
    NotPattern = pattern.NotPattern,
    ExistsPattern = pattern.ExistsPattern,
    FromNotPattern = pattern.FromNotPattern,
    FromExistsPattern = pattern.FromExistsPattern,
    CompositePattern = pattern.CompositePattern;

var parseConstraint = function (constraint) {
    if (typeof constraint === 'function') {
        // No parsing is needed for constraint functions
        return constraint;
    }
    return parser.parseConstraint(constraint);
};

var parseExtra = extd
    .switcher()
    .isUndefinedOrNull(function () {
        return null;
    })
    .isLike(/^from +/, function (s) {
        return {from: s.replace(/^from +/, "").replace(/^\s*|\s*$/g, "")};
    })
    .def(function (o) {
        throw new Error("invalid rule constraint option " + o);
    })
    .switcher();

var normailizeConstraint = extd
    .switcher()
    .isLength(1, function (c) {
        throw new Error("invalid rule constraint " + format("%j", [c]));
    })
    .isLength(2, function (c) {
        c.push("true");
        return c;
    })
    //handle case where c[2] is a hash rather than a constraint string
    .isLength(3, function (c) {
        if (isString(c[2]) && /^from +/.test(c[2])) {
            var extra = c[2];
            c.splice(2, 0, "true");
            c[3] = null;
            c[4] = parseExtra(extra);
        } else if (isHash(c[2])) {
            c.splice(2, 0, "true");
        }
        return c;
    })
    //handle case where c[3] is a from clause rather than a hash for references
    .isLength(4, function (c) {
        if (isString(c[3])) {
            c.splice(3, 0, null);
            c[4] = parseExtra(c[4]);
        }
        return c;
    })
    .def(function (c) {
        if (c.length === 5) {
            c[4] = parseExtra(c[4]);
        }
        return c;
    })
    .switcher();

var getParamType = function getParamType(type, scope) {
    scope = scope || {};
    var getParamTypeSwitch = extd
        .switcher()
        .isEq("string", function () {
            return String;
        })
        .isEq("date", function () {
            return Date;
        })
        .isEq("array", function () {
            return Array;
        })
        .isEq("boolean", function () {
            return Boolean;
        })
        .isEq("regexp", function () {
            return RegExp;
        })
        .isEq("number", function () {
            return Number;
        })
        .isEq("object", function () {
            return Object;
        })
        .isEq("hash", function () {
            return Object;
        })
        .def(function (param) {
            throw new TypeError("invalid param type " + param);
        })
        .switcher();

    var _getParamType = extd
        .switcher()
        .isString(function (param) {
            var t = scope[param];
            if (!t) {
                return getParamTypeSwitch(param.toLowerCase());
            } else {
                return t;
            }
        })
        .isFunction(function (func) {
            return func;
        })
        .deepEqual([], function () {
            return Array;
        })
        .def(function (param) {
            throw  new Error("invalid param type " + param);
        })
        .switcher();

    return _getParamType(type);
};

var parsePattern = extd
    .switcher()
    .containsAt("or", 0, function (condition) {
        condition.shift();
        return extd(condition).map(function (cond) {
            cond.scope = condition.scope;
            return parsePattern(cond);
        }).flatten().value();
    })
    .containsAt("not", 0, function (condition) {
        condition.shift();
        condition = normailizeConstraint(condition);
        if (condition[4] && condition[4].from) {
            return [
                new FromNotPattern(
                    getParamType(condition[0], condition.scope),
                    condition[1] || "m",
                    parseConstraint(condition[2] || "true"),
                    condition[3] || {},
                    parseConstraint(condition[4].from),
                    {scope: condition.scope, pattern: condition[2]}
                )
            ];
        } else {
            return [
                new NotPattern(
                    getParamType(condition[0], condition.scope),
                    condition[1] || "m",
                    parseConstraint(condition[2] || "true"),
                    condition[3] || {},
                    {scope: condition.scope, pattern: condition[2]}
                )
            ];
        }
    })
    .containsAt("exists", 0, function (condition) {
        condition.shift();
        condition = normailizeConstraint(condition);
        if (condition[4] && condition[4].from) {
            return [
                new FromExistsPattern(
                    getParamType(condition[0], condition.scope),
                    condition[1] || "m",
                    parseConstraint(condition[2] || "true"),
                    condition[3] || {},
                    parseConstraint(condition[4].from),
                    {scope: condition.scope, pattern: condition[2]}
                )
            ];
        } else {
            return [
                new ExistsPattern(
                    getParamType(condition[0], condition.scope),
                    condition[1] || "m",
                    parseConstraint(condition[2] || "true"),
                    condition[3] || {},
                    {scope: condition.scope, pattern: condition[2]}
                )
            ];
        }
    })
    .def(function (condition) {
        if (typeof condition === 'function') {
            return [condition];
        }
        condition = normailizeConstraint(condition);
        if (condition[4] && condition[4].from) {
            return [
                new FromPattern(
                    getParamType(condition[0], condition.scope),
                    condition[1] || "m",
                    parseConstraint(condition[2] || "true"),
                    condition[3] || {},
                    parseConstraint(condition[4].from),
                    {scope: condition.scope, pattern: condition[2]}
                )
            ];
        } else {
            return [
                new ObjectPattern(
                    getParamType(condition[0], condition.scope),
                    condition[1] || "m",
                    parseConstraint(condition[2] || "true"),
                    condition[3] || {},
                    {scope: condition.scope, pattern: condition[2]}
                )
            ];
        }
    }).switcher();

var Rule = declare({
    instance: {
        constructor: function (name, options, pattern, cb) {
            this.name = name;
            this.pattern = pattern;
            this.cb = cb;
            if (options.agendaGroup) {
                this.agendaGroup = options.agendaGroup;
                this.autoFocus = extd.isBoolean(options.autoFocus) ? options.autoFocus : false;
            }
            this.priority = options.priority || options.salience || 0;
        },

        fire: function (flow, match) {
            var ret = new Promise(), cb = this.cb;
            try {
                if (cb.length === 3) {
                    cb.call(flow, match.factHash, flow, ret.resolve);
                } else {
                    ret = cb.call(flow, match.factHash, flow);
                }
            } catch (e) {
                ret.errback(e);
            }
            return ret;
        }
    }
});

function createRule(name, options, conditions, cb) {
    if (isArray(options)) {
        cb = conditions;
        conditions = options;
    } else {
        options = options || {};
    }
    var isRules = extd.every(conditions, function (cond) {
        return isArray(cond);
    });
    if (isRules && conditions.length === 1) {
        conditions = conditions[0];
        isRules = false;
    }
    var rules = [];
    var scope = options.scope || {};
    conditions.scope = scope;
    if (isRules) {
        var _mergePatterns = function (patt, i) {
            if (!patterns[i]) {
                patterns[i] = i === 0 ? [] : patterns[i - 1].slice();
                //remove dup
                if (i !== 0) {
                    patterns[i].pop();
                }
                patterns[i].push(patt);
            } else {
                extd(patterns).forEach(function (p) {
                    p.push(patt);
                });
            }

        };
        var l = conditions.length, patterns = [], condition;
        for (var i = 0; i < l; i++) {
            condition = conditions[i];
            condition.scope = scope;
            extd.forEach(parsePattern(condition), _mergePatterns);

        }
        rules = extd.map(patterns, function (patterns) {
            var compPat = null;
            for (var i = 0; i < patterns.length; i++) {
                if (compPat === null) {
                    compPat = new CompositePattern(patterns[i++], patterns[i]);
                } else {
                    compPat = new CompositePattern(compPat, patterns[i]);
                }
            }
            return new Rule(name, options, compPat, cb);
        });
    } else {
        rules = extd.map(parsePattern(conditions), function (cond) {
            return new Rule(name, options, cond, cb);
        });
    }
    return rules;
}

exports.createRule = createRule;




},{"./extended":12,"./parser":44,"./pattern":48}],50:[function(require,module,exports){
"use strict";
var declare = require("declare.js"),
    LinkedList = require("./linkedList"),
    InitialFact = require("./pattern").InitialFact,
    id = 0;

var Fact = declare({

    instance: {
        constructor: function (obj) {
            this.object = obj;
            this.recency = 0;
            this.id = id++;
        },

        equals: function (fact) {
            return fact === this.object;
        },

        hashCode: function () {
            return this.id;
        }
    }

});

declare({

    instance: {

        constructor: function () {
            this.recency = 0;
            this.facts = new LinkedList();
        },

        dispose: function () {
            this.facts.clear();
        },

        getFacts: function () {
            var head = {next: this.facts.head}, ret = [], i = 0, val;
            while ((head = head.next)) {
                if (!((val = head.data.object)  instanceof InitialFact)) {
                    ret[i++] = val;
                }
            }
            return ret;
        },

        getFactsByType: function (Type) {
            var head = {next: this.facts.head}, ret = [], i = 0;
            while ((head = head.next)) {
                var val = head.data.object;
                if (!(val  instanceof InitialFact) && (val instanceof Type || val.constructor === Type)) {
                    ret[i++] = val;
                }
            }
            return ret;
        },

        getFactHandle: function (o) {
            var head = {next: this.facts.head}, ret;
            while ((head = head.next)) {
                var existingFact = head.data;
                if (existingFact.equals(o)) {
                    return existingFact;
                }
            }
            if (!ret) {
                ret = new Fact(o);
                ret.recency = this.recency++;
                //this.facts.push(ret);
            }
            return ret;
        },

        modifyFact: function (fact) {
            var head = {next: this.facts.head};
            while ((head = head.next)) {
                var existingFact = head.data;
                if (existingFact.equals(fact)) {
                    existingFact.recency = this.recency++;
                    return existingFact;
                }
            }
            //if we made it here we did not find the fact
            throw new Error("the fact to modify does not exist");
        },

        assertFact: function (fact) {
            var ret = new Fact(fact);
            ret.recency = this.recency++;
            this.facts.push(ret);
            return ret;
        },

        retractFact: function (fact) {
            var facts = this.facts, head = {next: facts.head};
            while ((head = head.next)) {
                var existingFact = head.data;
                if (existingFact.equals(fact)) {
                    facts.remove(head);
                    return existingFact;
                }
            }
            //if we made it here we did not find the fact
            throw new Error("the fact to remove does not exist");


        }
    }

}).as(exports, "WorkingMemory");


},{"./linkedList":16,"./pattern":48,"declare.js":55}],51:[function(require,module,exports){
(function () {
    "use strict";

    function defineArgumentsExtended(extended, is) {

        var pSlice = Array.prototype.slice,
            isArguments = is.isArguments;

        function argsToArray(args, slice) {
            var i = -1, j = 0, l = args.length, ret = [];
            slice = slice || 0;
            i += slice;
            while (++i < l) {
                ret[j++] = args[i];
            }
            return ret;
        }


        return extended
            .define(isArguments, {
                toArray: argsToArray
            })
            .expose({
                argsToArray: argsToArray
            });
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineArgumentsExtended(require("extended"), require("is-extended"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended", "is-extended"], function (extended, is) {
            return defineArgumentsExtended(extended, is);
        });
    } else {
        this.argumentsExtended = defineArgumentsExtended(this.extended, this.isExtended);
    }

}).call(this);


},{"extended":56,"is-extended":66}],52:[function(require,module,exports){
(function () {
    "use strict";
    /*global define*/

    function defineArray(extended, is, args) {

        var isString = is.isString,
            isArray = Array.isArray || is.isArray,
            isDate = is.isDate,
            floor = Math.floor,
            abs = Math.abs,
            mathMax = Math.max,
            mathMin = Math.min,
            arrayProto = Array.prototype,
            arrayIndexOf = arrayProto.indexOf,
            arrayForEach = arrayProto.forEach,
            arrayMap = arrayProto.map,
            arrayReduce = arrayProto.reduce,
            arrayReduceRight = arrayProto.reduceRight,
            arrayFilter = arrayProto.filter,
            arrayEvery = arrayProto.every,
            arraySome = arrayProto.some,
            argsToArray = args.argsToArray;


        function cross(num, cros) {
            return reduceRight(cros, function (a, b) {
                if (!isArray(b)) {
                    b = [b];
                }
                b.unshift(num);
                a.unshift(b);
                return a;
            }, []);
        }

        function permute(num, cross, length) {
            var ret = [];
            for (var i = 0; i < cross.length; i++) {
                ret.push([num].concat(rotate(cross, i)).slice(0, length));
            }
            return ret;
        }


        function intersection(a, b) {
            var ret = [], aOne, i = -1, l;
            l = a.length;
            while (++i < l) {
                aOne = a[i];
                if (indexOf(b, aOne) !== -1) {
                    ret.push(aOne);
                }
            }
            return ret;
        }


        var _sort = (function () {

            var isAll = function (arr, test) {
                return every(arr, test);
            };

            var defaultCmp = function (a, b) {
                return a - b;
            };

            var dateSort = function (a, b) {
                return a.getTime() - b.getTime();
            };

            return function _sort(arr, property) {
                var ret = [];
                if (isArray(arr)) {
                    ret = arr.slice();
                    if (property) {
                        if (typeof property === "function") {
                            ret.sort(property);
                        } else {
                            ret.sort(function (a, b) {
                                var aProp = a[property], bProp = b[property];
                                if (isString(aProp) && isString(bProp)) {
                                    return aProp > bProp ? 1 : aProp < bProp ? -1 : 0;
                                } else if (isDate(aProp) && isDate(bProp)) {
                                    return aProp.getTime() - bProp.getTime();
                                } else {
                                    return aProp - bProp;
                                }
                            });
                        }
                    } else {
                        if (isAll(ret, isString)) {
                            ret.sort();
                        } else if (isAll(ret, isDate)) {
                            ret.sort(dateSort);
                        } else {
                            ret.sort(defaultCmp);
                        }
                    }
                }
                return ret;
            };

        })();

        function indexOf(arr, searchElement, from) {
            var index = (from || 0) - 1,
                length = arr.length;
            while (++index < length) {
                if (arr[index] === searchElement) {
                    return index;
                }
            }
            return -1;
        }

        function lastIndexOf(arr, searchElement, from) {
            if (!isArray(arr)) {
                throw new TypeError();
            }

            var t = Object(arr);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }

            var n = len;
            if (arguments.length > 2) {
                n = Number(arguments[2]);
                if (n !== n) {
                    n = 0;
                } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                    n = (n > 0 || -1) * floor(abs(n));
                }
            }

            var k = n >= 0 ? mathMin(n, len - 1) : len - abs(n);

            for (; k >= 0; k--) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        }

        function filter(arr, iterator, scope) {
            if (arr && arrayFilter && arrayFilter === arr.filter) {
                return arr.filter(iterator, scope);
            }
            if (!isArray(arr) || typeof iterator !== "function") {
                throw new TypeError();
            }

            var t = Object(arr);
            var len = t.length >>> 0;
            var res = [];
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    var val = t[i]; // in case fun mutates this
                    if (iterator.call(scope, val, i, t)) {
                        res.push(val);
                    }
                }
            }
            return res;
        }

        function forEach(arr, iterator, scope) {
            if (!isArray(arr) || typeof iterator !== "function") {
                throw new TypeError();
            }
            if (arr && arrayForEach && arrayForEach === arr.forEach) {
                arr.forEach(iterator, scope);
                return arr;
            }
            for (var i = 0, len = arr.length; i < len; ++i) {
                iterator.call(scope || arr, arr[i], i, arr);
            }

            return arr;
        }

        function every(arr, iterator, scope) {
            if (arr && arrayEvery && arrayEvery === arr.every) {
                return arr.every(iterator, scope);
            }
            if (!isArray(arr) || typeof iterator !== "function") {
                throw new TypeError();
            }
            var t = Object(arr);
            var len = t.length >>> 0;
            for (var i = 0; i < len; i++) {
                if (i in t && !iterator.call(scope, t[i], i, t)) {
                    return false;
                }
            }
            return true;
        }

        function some(arr, iterator, scope) {
            if (arr && arraySome && arraySome === arr.some) {
                return arr.some(iterator, scope);
            }
            if (!isArray(arr) || typeof iterator !== "function") {
                throw new TypeError();
            }
            var t = Object(arr);
            var len = t.length >>> 0;
            for (var i = 0; i < len; i++) {
                if (i in t && iterator.call(scope, t[i], i, t)) {
                    return true;
                }
            }
            return false;
        }

        function map(arr, iterator, scope) {
            if (arr && arrayMap && arrayMap === arr.map) {
                return arr.map(iterator, scope);
            }
            if (!isArray(arr) || typeof iterator !== "function") {
                throw new TypeError();
            }

            var t = Object(arr);
            var len = t.length >>> 0;
            var res = [];
            for (var i = 0; i < len; i++) {
                if (i in t) {
                    res.push(iterator.call(scope, t[i], i, t));
                }
            }
            return res;
        }

        function reduce(arr, accumulator, curr) {
            var initial = arguments.length > 2;
            if (arr && arrayReduce && arrayReduce === arr.reduce) {
                return initial ? arr.reduce(accumulator, curr) : arr.reduce(accumulator);
            }
            if (!isArray(arr) || typeof accumulator !== "function") {
                throw new TypeError();
            }
            var i = 0, l = arr.length >> 0;
            if (arguments.length < 3) {
                if (l === 0) {
                    throw new TypeError("Array length is 0 and no second argument");
                }
                curr = arr[0];
                i = 1; // start accumulating at the second element
            } else {
                curr = arguments[2];
            }
            while (i < l) {
                if (i in arr) {
                    curr = accumulator.call(undefined, curr, arr[i], i, arr);
                }
                ++i;
            }
            return curr;
        }

        function reduceRight(arr, accumulator, curr) {
            var initial = arguments.length > 2;
            if (arr && arrayReduceRight && arrayReduceRight === arr.reduceRight) {
                return initial ? arr.reduceRight(accumulator, curr) : arr.reduceRight(accumulator);
            }
            if (!isArray(arr) || typeof accumulator !== "function") {
                throw new TypeError();
            }

            var t = Object(arr);
            var len = t.length >>> 0;

            // no value to return if no initial value, empty array
            if (len === 0 && arguments.length === 2) {
                throw new TypeError();
            }

            var k = len - 1;
            if (arguments.length >= 3) {
                curr = arguments[2];
            } else {
                do {
                    if (k in arr) {
                        curr = arr[k--];
                        break;
                    }
                }
                while (true);
            }
            while (k >= 0) {
                if (k in t) {
                    curr = accumulator.call(undefined, curr, t[k], k, t);
                }
                k--;
            }
            return curr;
        }


        function toArray(o) {
            var ret = [];
            if (o !== null) {
                var args = argsToArray(arguments);
                if (args.length === 1) {
                    if (isArray(o)) {
                        ret = o;
                    } else if (is.isHash(o)) {
                        for (var i in o) {
                            if (o.hasOwnProperty(i)) {
                                ret.push([i, o[i]]);
                            }
                        }
                    } else {
                        ret.push(o);
                    }
                } else {
                    forEach(args, function (a) {
                        ret = ret.concat(toArray(a));
                    });
                }
            }
            return ret;
        }

        function sum(array) {
            array = array || [];
            if (array.length) {
                return reduce(array, function (a, b) {
                    return a + b;
                });
            } else {
                return 0;
            }
        }

        function avg(arr) {
            arr = arr || [];
            if (arr.length) {
                var total = sum(arr);
                if (is.isNumber(total)) {
                    return  total / arr.length;
                } else {
                    throw new Error("Cannot average an array of non numbers.");
                }
            } else {
                return 0;
            }
        }

        function sort(arr, cmp) {
            return _sort(arr, cmp);
        }

        function min(arr, cmp) {
            return _sort(arr, cmp)[0];
        }

        function max(arr, cmp) {
            return _sort(arr, cmp)[arr.length - 1];
        }

        function difference(arr1) {
            var ret = arr1, args = flatten(argsToArray(arguments, 1));
            if (isArray(arr1)) {
                ret = filter(arr1, function (a) {
                    return indexOf(args, a) === -1;
                });
            }
            return ret;
        }

        function removeDuplicates(arr) {
            var ret = [], i = -1, l, retLength = 0;
            if (arr) {
                l = arr.length;
                while (++i < l) {
                    var item = arr[i];
                    if (indexOf(ret, item) === -1) {
                        ret[retLength++] = item;
                    }
                }
            }
            return ret;
        }


        function unique(arr) {
            return removeDuplicates(arr);
        }


        function rotate(arr, numberOfTimes) {
            var ret = arr.slice();
            if (typeof numberOfTimes !== "number") {
                numberOfTimes = 1;
            }
            if (numberOfTimes && isArray(arr)) {
                if (numberOfTimes > 0) {
                    ret.push(ret.shift());
                    numberOfTimes--;
                } else {
                    ret.unshift(ret.pop());
                    numberOfTimes++;
                }
                return rotate(ret, numberOfTimes);
            } else {
                return ret;
            }
        }

        function permutations(arr, length) {
            var ret = [];
            if (isArray(arr)) {
                var copy = arr.slice(0);
                if (typeof length !== "number") {
                    length = arr.length;
                }
                if (!length) {
                    ret = [
                        []
                    ];
                } else if (length <= arr.length) {
                    ret = reduce(arr, function (a, b, i) {
                        var ret;
                        if (length > 1) {
                            ret = permute(b, rotate(copy, i).slice(1), length);
                        } else {
                            ret = [
                                [b]
                            ];
                        }
                        return a.concat(ret);
                    }, []);
                }
            }
            return ret;
        }

        function zip() {
            var ret = [];
            var arrs = argsToArray(arguments);
            if (arrs.length > 1) {
                var arr1 = arrs.shift();
                if (isArray(arr1)) {
                    ret = reduce(arr1, function (a, b, i) {
                        var curr = [b];
                        for (var j = 0; j < arrs.length; j++) {
                            var currArr = arrs[j];
                            if (isArray(currArr) && !is.isUndefined(currArr[i])) {
                                curr.push(currArr[i]);
                            } else {
                                curr.push(null);
                            }
                        }
                        a.push(curr);
                        return a;
                    }, []);
                }
            }
            return ret;
        }

        function transpose(arr) {
            var ret = [];
            if (isArray(arr) && arr.length) {
                var last;
                forEach(arr, function (a) {
                    if (isArray(a) && (!last || a.length === last.length)) {
                        forEach(a, function (b, i) {
                            if (!ret[i]) {
                                ret[i] = [];
                            }
                            ret[i].push(b);
                        });
                        last = a;
                    }
                });
            }
            return ret;
        }

        function valuesAt(arr, indexes) {
            var ret = [];
            indexes = argsToArray(arguments);
            arr = indexes.shift();
            if (isArray(arr) && indexes.length) {
                for (var i = 0, l = indexes.length; i < l; i++) {
                    ret.push(arr[indexes[i]] || null);
                }
            }
            return ret;
        }

        function union() {
            var ret = [];
            var arrs = argsToArray(arguments);
            if (arrs.length > 1) {
                for (var i = 0, l = arrs.length; i < l; i++) {
                    ret = ret.concat(arrs[i]);
                }
                ret = removeDuplicates(ret);
            }
            return ret;
        }

        function intersect() {
            var collect = [], sets, i = -1 , l;
            if (arguments.length > 1) {
                //assume we are intersections all the lists in the array
                sets = argsToArray(arguments);
            } else {
                sets = arguments[0];
            }
            if (isArray(sets)) {
                collect = sets[0];
                i = 0;
                l = sets.length;
                while (++i < l) {
                    collect = intersection(collect, sets[i]);
                }
            }
            return removeDuplicates(collect);
        }

        function powerSet(arr) {
            var ret = [];
            if (isArray(arr) && arr.length) {
                ret = reduce(arr, function (a, b) {
                    var ret = map(a, function (c) {
                        return c.concat(b);
                    });
                    return a.concat(ret);
                }, [
                    []
                ]);
            }
            return ret;
        }

        function cartesian(a, b) {
            var ret = [];
            if (isArray(a) && isArray(b) && a.length && b.length) {
                ret = cross(a[0], b).concat(cartesian(a.slice(1), b));
            }
            return ret;
        }

        function compact(arr) {
            var ret = [];
            if (isArray(arr) && arr.length) {
                ret = filter(arr, function (item) {
                    return !is.isUndefinedOrNull(item);
                });
            }
            return ret;
        }

        function multiply(arr, times) {
            times = is.isNumber(times) ? times : 1;
            if (!times) {
                //make sure times is greater than zero if it is zero then dont multiply it
                times = 1;
            }
            arr = toArray(arr || []);
            var ret = [], i = 0;
            while (++i <= times) {
                ret = ret.concat(arr);
            }
            return ret;
        }

        function flatten(arr) {
            var set;
            var args = argsToArray(arguments);
            if (args.length > 1) {
                //assume we are intersections all the lists in the array
                set = args;
            } else {
                set = toArray(arr);
            }
            return reduce(set, function (a, b) {
                return a.concat(b);
            }, []);
        }

        function pluck(arr, prop) {
            prop = prop.split(".");
            var result = arr.slice(0);
            forEach(prop, function (prop) {
                var exec = prop.match(/(\w+)\(\)$/);
                result = map(result, function (item) {
                    return exec ? item[exec[1]]() : item[prop];
                });
            });
            return result;
        }

        function invoke(arr, func, args) {
            args = argsToArray(arguments, 2);
            return map(arr, function (item) {
                var exec = isString(func) ? item[func] : func;
                return exec.apply(item, args);
            });
        }


        var array = {
            toArray: toArray,
            sum: sum,
            avg: avg,
            sort: sort,
            min: min,
            max: max,
            difference: difference,
            removeDuplicates: removeDuplicates,
            unique: unique,
            rotate: rotate,
            permutations: permutations,
            zip: zip,
            transpose: transpose,
            valuesAt: valuesAt,
            union: union,
            intersect: intersect,
            powerSet: powerSet,
            cartesian: cartesian,
            compact: compact,
            multiply: multiply,
            flatten: flatten,
            pluck: pluck,
            invoke: invoke,
            forEach: forEach,
            map: map,
            filter: filter,
            reduce: reduce,
            reduceRight: reduceRight,
            some: some,
            every: every,
            indexOf: indexOf,
            lastIndexOf: lastIndexOf
        };

        return extended.define(isArray, array).expose(array);
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineArray(require("extended"), require("is-extended"), require("arguments-extended"));
        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended", "is-extended", "arguments-extended"], function (extended, is, args) {
            return defineArray(extended, is, args);
        });
    } else {
        this.arrayExtended = defineArray(this.extended, this.isExtended, this.argumentsExtended);
    }

}).call(this);







},{"arguments-extended":51,"extended":56,"is-extended":66}],53:[function(require,module,exports){
(function () {
    "use strict";

    function defineDate(extended, is, array) {

        function _pad(string, length, ch, end) {
            string = "" + string; //check for numbers
            ch = ch || " ";
            var strLen = string.length;
            while (strLen < length) {
                if (end) {
                    string += ch;
                } else {
                    string = ch + string;
                }
                strLen++;
            }
            return string;
        }

        function _truncate(string, length, end) {
            var ret = string;
            if (is.isString(ret)) {
                if (string.length > length) {
                    if (end) {
                        var l = string.length;
                        ret = string.substring(l - length, l);
                    } else {
                        ret = string.substring(0, length);
                    }
                }
            } else {
                ret = _truncate("" + ret, length);
            }
            return ret;
        }

        function every(arr, iterator, scope) {
            if (!is.isArray(arr) || typeof iterator !== "function") {
                throw new TypeError();
            }
            var t = Object(arr);
            var len = t.length >>> 0;
            for (var i = 0; i < len; i++) {
                if (i in t && !iterator.call(scope, t[i], i, t)) {
                    return false;
                }
            }
            return true;
        }


        var transforms = (function () {
                var floor = Math.floor, round = Math.round;

                var addMap = {
                    day: function addDay(date, amount) {
                        return [amount, "Date", false];
                    },
                    weekday: function addWeekday(date, amount) {
                        // Divide the increment time span into weekspans plus leftover days
                        // e.g., 8 days is one 5-day weekspan / and two leftover days
                        // Can't have zero leftover days, so numbers divisible by 5 get
                        // a days value of 5, and the remaining days make up the number of weeks
                        var days, weeks, mod = amount % 5, strt = date.getDay(), adj = 0;
                        if (!mod) {
                            days = (amount > 0) ? 5 : -5;
                            weeks = (amount > 0) ? ((amount - 5) / 5) : ((amount + 5) / 5);
                        } else {
                            days = mod;
                            weeks = parseInt(amount / 5, 10);
                        }
                        if (strt === 6 && amount > 0) {
                            adj = 1;
                        } else if (strt === 0 && amount < 0) {
                            // Orig date is Sun / negative increment
                            // Jump back over Sat
                            adj = -1;
                        }
                        // Get weekday val for the new date
                        var trgt = strt + days;
                        // New date is on Sat or Sun
                        if (trgt === 0 || trgt === 6) {
                            adj = (amount > 0) ? 2 : -2;
                        }
                        // Increment by number of weeks plus leftover days plus
                        // weekend adjustments
                        return [(7 * weeks) + days + adj, "Date", false];
                    },
                    year: function addYear(date, amount) {
                        return [amount, "FullYear", true];
                    },
                    week: function addWeek(date, amount) {
                        return [amount * 7, "Date", false];
                    },
                    quarter: function addYear(date, amount) {
                        return [amount * 3, "Month", true];
                    },
                    month: function addYear(date, amount) {
                        return [amount, "Month", true];
                    }
                };

                function addTransform(interval, date, amount) {
                    interval = interval.replace(/s$/, "");
                    if (addMap.hasOwnProperty(interval)) {
                        return addMap[interval](date, amount);
                    }
                    return [amount, "UTC" + interval.charAt(0).toUpperCase() + interval.substring(1) + "s", false];
                }


                var differenceMap = {
                    "quarter": function quarterDifference(date1, date2, utc) {
                        var yearDiff = date2.getFullYear() - date1.getFullYear();
                        var m1 = date1[utc ? "getUTCMonth" : "getMonth"]();
                        var m2 = date2[utc ? "getUTCMonth" : "getMonth"]();
                        // Figure out which quarter the months are in
                        var q1 = floor(m1 / 3) + 1;
                        var q2 = floor(m2 / 3) + 1;
                        // Add quarters for any year difference between the dates
                        q2 += (yearDiff * 4);
                        return q2 - q1;
                    },

                    "weekday": function weekdayDifference(date1, date2, utc) {
                        var days = differenceTransform("day", date1, date2, utc), weeks;
                        var mod = days % 7;
                        // Even number of weeks
                        if (mod === 0) {
                            days = differenceTransform("week", date1, date2, utc) * 5;
                        } else {
                            // Weeks plus spare change (< 7 days)
                            var adj = 0, aDay = date1[utc ? "getUTCDay" : "getDay"](), bDay = date2[utc ? "getUTCDay" : "getDay"]();
                            weeks = parseInt(days / 7, 10);
                            // Mark the date advanced by the number of
                            // round weeks (may be zero)
                            var dtMark = new Date(+date1);
                            dtMark.setDate(dtMark[utc ? "getUTCDate" : "getDate"]() + (weeks * 7));
                            var dayMark = dtMark[utc ? "getUTCDay" : "getDay"]();

                            // Spare change days -- 6 or less
                            if (days > 0) {
                                if (aDay === 6 || bDay === 6) {
                                    adj = -1;
                                } else if (aDay === 0) {
                                    adj = 0;
                                } else if (bDay === 0 || (dayMark + mod) > 5) {
                                    adj = -2;
                                }
                            } else if (days < 0) {
                                if (aDay === 6) {
                                    adj = 0;
                                } else if (aDay === 0 || bDay === 0) {
                                    adj = 1;
                                } else if (bDay === 6 || (dayMark + mod) < 0) {
                                    adj = 2;
                                }
                            }
                            days += adj;
                            days -= (weeks * 2);
                        }
                        return days;
                    },
                    year: function (date1, date2) {
                        return date2.getFullYear() - date1.getFullYear();
                    },
                    month: function (date1, date2, utc) {
                        var m1 = date1[utc ? "getUTCMonth" : "getMonth"]();
                        var m2 = date2[utc ? "getUTCMonth" : "getMonth"]();
                        return (m2 - m1) + ((date2.getFullYear() - date1.getFullYear()) * 12);
                    },
                    week: function (date1, date2, utc) {
                        return round(differenceTransform("day", date1, date2, utc) / 7);
                    },
                    day: function (date1, date2) {
                        return 1.1574074074074074e-8 * (date2.getTime() - date1.getTime());
                    },
                    hour: function (date1, date2) {
                        return 2.7777777777777776e-7 * (date2.getTime() - date1.getTime());
                    },
                    minute: function (date1, date2) {
                        return 0.000016666666666666667 * (date2.getTime() - date1.getTime());
                    },
                    second: function (date1, date2) {
                        return 0.001 * (date2.getTime() - date1.getTime());
                    },
                    millisecond: function (date1, date2) {
                        return date2.getTime() - date1.getTime();
                    }
                };


                function differenceTransform(interval, date1, date2, utc) {
                    interval = interval.replace(/s$/, "");
                    return round(differenceMap[interval](date1, date2, utc));
                }


                return {
                    addTransform: addTransform,
                    differenceTransform: differenceTransform
                };
            }()),
            addTransform = transforms.addTransform,
            differenceTransform = transforms.differenceTransform;


        /**
         * @ignore
         * Based on DOJO Date Implementation
         *
         * Dojo is available under *either* the terms of the modified BSD license *or* the
         * Academic Free License version 2.1. As a recipient of Dojo, you may choose which
         * license to receive this code under (except as noted in per-module LICENSE
         * files). Some modules may not be the copyright of the Dojo Foundation. These
         * modules contain explicit declarations of copyright in both the LICENSE files in
         * the directories in which they reside and in the code itself. No external
         * contributions are allowed under licenses which are fundamentally incompatible
         * with the AFL or BSD licenses that Dojo is distributed under.
         *
         */

        var floor = Math.floor, round = Math.round, min = Math.min, pow = Math.pow, ceil = Math.ceil, abs = Math.abs;
        var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthAbbr = ["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."];
        var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var dayAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var eraNames = ["Before Christ", "Anno Domini"];
        var eraAbbr = ["BC", "AD"];


        function getDayOfYear(/*Date*/dateObject, utc) {
            // summary: gets the day of the year as represented by dateObject
            return date.difference(new Date(dateObject.getFullYear(), 0, 1, dateObject.getHours()), dateObject, null, utc) + 1; // Number
        }

        function getWeekOfYear(/*Date*/dateObject, /*Number*/firstDayOfWeek, utc) {
            firstDayOfWeek = firstDayOfWeek || 0;
            var fullYear = dateObject[utc ? "getUTCFullYear" : "getFullYear"]();
            var firstDayOfYear = new Date(fullYear, 0, 1).getDay(),
                adj = (firstDayOfYear - firstDayOfWeek + 7) % 7,
                week = floor((getDayOfYear(dateObject) + adj - 1) / 7);

            // if year starts on the specified day, start counting weeks at 1
            if (firstDayOfYear === firstDayOfWeek) {
                week++;
            }

            return week; // Number
        }

        function getTimezoneName(/*Date*/dateObject) {
            var str = dateObject.toString();
            var tz = '';
            var pos = str.indexOf('(');
            if (pos > -1) {
                tz = str.substring(++pos, str.indexOf(')'));
            }
            return tz; // String
        }


        function buildDateEXP(pattern, tokens) {
            return pattern.replace(/([a-z])\1*/ig,function (match) {
                // Build a simple regexp.  Avoid captures, which would ruin the tokens list
                var s,
                    c = match.charAt(0),
                    l = match.length,
                    p2 = '0?',
                    p3 = '0{0,2}';
                if (c === 'y') {
                    s = '\\d{2,4}';
                } else if (c === "M") {
                    s = (l > 2) ? '\\S+?' : '1[0-2]|' + p2 + '[1-9]';
                } else if (c === "D") {
                    s = '[12][0-9][0-9]|3[0-5][0-9]|36[0-6]|' + p3 + '[1-9][0-9]|' + p2 + '[1-9]';
                } else if (c === "d") {
                    s = '3[01]|[12]\\d|' + p2 + '[1-9]';
                } else if (c === "w") {
                    s = '[1-4][0-9]|5[0-3]|' + p2 + '[1-9]';
                } else if (c === "E") {
                    s = '\\S+';
                } else if (c === "h") {
                    s = '1[0-2]|' + p2 + '[1-9]';
                } else if (c === "K") {
                    s = '1[01]|' + p2 + '\\d';
                } else if (c === "H") {
                    s = '1\\d|2[0-3]|' + p2 + '\\d';
                } else if (c === "k") {
                    s = '1\\d|2[0-4]|' + p2 + '[1-9]';
                } else if (c === "m" || c === "s") {
                    s = '[0-5]\\d';
                } else if (c === "S") {
                    s = '\\d{' + l + '}';
                } else if (c === "a") {
                    var am = 'AM', pm = 'PM';
                    s = am + '|' + pm;
                    if (am !== am.toLowerCase()) {
                        s += '|' + am.toLowerCase();
                    }
                    if (pm !== pm.toLowerCase()) {
                        s += '|' + pm.toLowerCase();
                    }
                    s = s.replace(/\./g, "\\.");
                } else if (c === 'v' || c === 'z' || c === 'Z' || c === 'G' || c === 'q' || c === 'Q') {
                    s = ".*";
                } else {
                    s = c === " " ? "\\s*" : c + "*";
                }
                if (tokens) {
                    tokens.push(match);
                }

                return "(" + s + ")"; // add capture
            }).replace(/[\xa0 ]/g, "[\\s\\xa0]"); // normalize whitespace.  Need explicit handling of \xa0 for IE.
        }


        /**
         * @namespace Utilities for Dates
         */
        var date = {

            /**@lends date*/

            /**
             * Returns the number of days in the month of a date
             *
             * @example
             *
             *  dateExtender.getDaysInMonth(new Date(2006, 1, 1)); //28
             *  dateExtender.getDaysInMonth(new Date(2004, 1, 1)); //29
             *  dateExtender.getDaysInMonth(new Date(2006, 2, 1)); //31
             *  dateExtender.getDaysInMonth(new Date(2006, 3, 1)); //30
             *  dateExtender.getDaysInMonth(new Date(2006, 4, 1)); //31
             *  dateExtender.getDaysInMonth(new Date(2006, 5, 1)); //30
             *  dateExtender.getDaysInMonth(new Date(2006, 6, 1)); //31
             * @param {Date} dateObject the date containing the month
             * @return {Number} the number of days in the month
             */
            getDaysInMonth: function (/*Date*/dateObject) {
                //	summary:
                //		Returns the number of days in the month used by dateObject
                var month = dateObject.getMonth();
                var days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                if (month === 1 && date.isLeapYear(dateObject)) {
                    return 29;
                } // Number
                return days[month]; // Number
            },

            /**
             * Determines if a date is a leap year
             *
             * @example
             *
             *  dateExtender.isLeapYear(new Date(1600, 0, 1)); //true
             *  dateExtender.isLeapYear(new Date(2004, 0, 1)); //true
             *  dateExtender.isLeapYear(new Date(2000, 0, 1)); //true
             *  dateExtender.isLeapYear(new Date(2006, 0, 1)); //false
             *  dateExtender.isLeapYear(new Date(1900, 0, 1)); //false
             *  dateExtender.isLeapYear(new Date(1800, 0, 1)); //false
             *  dateExtender.isLeapYear(new Date(1700, 0, 1)); //false
             *
             * @param {Date} dateObject
             * @returns {Boolean} true if it is a leap year false otherwise
             */
            isLeapYear: function (/*Date*/dateObject, utc) {
                var year = dateObject[utc ? "getUTCFullYear" : "getFullYear"]();
                return (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0);

            },

            /**
             * Determines if a date is on a weekend
             *
             * @example
             *
             * var thursday = new Date(2006, 8, 21);
             * var saturday = new Date(2006, 8, 23);
             * var sunday = new Date(2006, 8, 24);
             * var monday = new Date(2006, 8, 25);
             * dateExtender.isWeekend(thursday)); //false
             * dateExtender.isWeekend(saturday); //true
             * dateExtender.isWeekend(sunday); //true
             * dateExtender.isWeekend(monday)); //false
             *
             * @param {Date} dateObject the date to test
             *
             * @returns {Boolean} true if the date is a weekend
             */
            isWeekend: function (/*Date?*/dateObject, utc) {
                // summary:
                //	Determines if the date falls on a weekend, according to local custom.
                var day = (dateObject || new Date())[utc ? "getUTCDay" : "getDay"]();
                return day === 0 || day === 6;
            },

            /**
             * Get the timezone of a date
             *
             * @example
             *  //just setting the strLocal to simulate the toString() of a date
             *  dt.str = 'Sun Sep 17 2006 22:25:51 GMT-0500 (CDT)';
             *  //just setting the strLocal to simulate the locale
             *  dt.strLocale = 'Sun 17 Sep 2006 10:25:51 PM CDT';
             *  dateExtender.getTimezoneName(dt); //'CDT'
             *  dt.str = 'Sun Sep 17 2006 22:57:18 GMT-0500 (CDT)';
             *  dt.strLocale = 'Sun Sep 17 22:57:18 2006';
             *  dateExtender.getTimezoneName(dt); //'CDT'
             * @param dateObject the date to get the timezone from
             *
             * @returns {String} the timezone of the date
             */
            getTimezoneName: getTimezoneName,

            /**
             * Compares two dates
             *
             * @example
             *
             * var d1 = new Date();
             * d1.setHours(0);
             * dateExtender.compare(d1, d1); // 0
             *
             *  var d1 = new Date();
             *  d1.setHours(0);
             *  var d2 = new Date();
             *  d2.setFullYear(2005);
             *  d2.setHours(12);
             *  dateExtender.compare(d1, d2, "date"); // 1
             *  dateExtender.compare(d1, d2, "datetime"); // 1
             *
             *  var d1 = new Date();
             *  d1.setHours(0);
             *  var d2 = new Date();
             *  d2.setFullYear(2005);
             *  d2.setHours(12);
             *  dateExtender.compare(d2, d1, "date"); // -1
             *  dateExtender.compare(d1, d2, "time"); //-1
             *
             * @param {Date|String} date1 the date to comapare
             * @param {Date|String} [date2=new Date()] the date to compare date1 againse
             * @param {"date"|"time"|"datetime"} portion compares the portion specified
             *
             * @returns -1 if date1 is < date2 0 if date1 === date2  1 if date1 > date2
             */
            compare: function (/*Date*/date1, /*Date*/date2, /*String*/portion) {
                date1 = new Date(+date1);
                date2 = new Date(+(date2 || new Date()));

                if (portion === "date") {
                    // Ignore times and compare dates.
                    date1.setHours(0, 0, 0, 0);
                    date2.setHours(0, 0, 0, 0);
                } else if (portion === "time") {
                    // Ignore dates and compare times.
                    date1.setFullYear(0, 0, 0);
                    date2.setFullYear(0, 0, 0);
                }
                return date1 > date2 ? 1 : date1 < date2 ? -1 : 0;
            },


            /**
             * Adds a specified interval and amount to a date
             *
             * @example
             *  var dtA = new Date(2005, 11, 27);
             *  dateExtender.add(dtA, "year", 1); //new Date(2006, 11, 27);
             *  dateExtender.add(dtA, "years", 1); //new Date(2006, 11, 27);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "quarter", 1); //new Date(2000, 3, 1);
             *  dateExtender.add(dtA, "quarters", 1); //new Date(2000, 3, 1);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "month", 1); //new Date(2000, 1, 1);
             *  dateExtender.add(dtA, "months", 1); //new Date(2000, 1, 1);
             *
             *  dtA = new Date(2000, 0, 31);
             *  dateExtender.add(dtA, "month", 1); //new Date(2000, 1, 29);
             *  dateExtender.add(dtA, "months", 1); //new Date(2000, 1, 29);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "week", 1); //new Date(2000, 0, 8);
             *  dateExtender.add(dtA, "weeks", 1); //new Date(2000, 0, 8);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "day", 1); //new Date(2000, 0, 2);
             *
             *  dtA = new Date(2000, 0, 1);
             *  dateExtender.add(dtA, "weekday", 1); //new Date(2000, 0, 3);
             *
             *  dtA = new Date(2000, 0, 1, 11);
             *  dateExtender.add(dtA, "hour", 1); //new Date(2000, 0, 1, 12);
             *
             *  dtA = new Date(2000, 11, 31, 23, 59);
             *  dateExtender.add(dtA, "minute", 1); //new Date(2001, 0, 1, 0, 0);
             *
             *  dtA = new Date(2000, 11, 31, 23, 59, 59);
             *  dateExtender.add(dtA, "second", 1); //new Date(2001, 0, 1, 0, 0, 0);
             *
             *  dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
             *  dateExtender.add(dtA, "millisecond", 1); //new Date(2001, 0, 1, 0, 0, 0, 0);
             *
             * @param {Date} date
             * @param {String} interval the interval to add
             *  <ul>
             *      <li>day | days</li>
             *      <li>weekday | weekdays</li>
             *      <li>year | years</li>
             *      <li>week | weeks</li>
             *      <li>quarter | quarters</li>
             *      <li>months | months</li>
             *      <li>hour | hours</li>
             *      <li>minute | minutes</li>
             *      <li>second | seconds</li>
             *      <li>millisecond | milliseconds</li>
             *  </ul>
             * @param {Number} [amount=0] the amount to add
             */
            add: function (/*Date*/date, /*String*/interval, /*int*/amount) {
                var res = addTransform(interval, date, amount || 0);
                amount = res[0];
                var property = res[1];
                var sum = new Date(+date);
                var fixOvershoot = res[2];
                if (property) {
                    sum["set" + property](sum["get" + property]() + amount);
                }

                if (fixOvershoot && (sum.getDate() < date.getDate())) {
                    sum.setDate(0);
                }

                return sum; // Date
            },

            /**
             * Finds the difference between two dates based on the specified interval
             *
             * @example
             *
             * var dtA, dtB;
             *
             * dtA = new Date(2005, 11, 27);
             * dtB = new Date(2006, 11, 27);
             * dateExtender.difference(dtA, dtB, "year"); //1
             *
             * dtA = new Date(2000, 1, 29);
             * dtB = new Date(2001, 2, 1);
             * dateExtender.difference(dtA, dtB, "quarter"); //4
             * dateExtender.difference(dtA, dtB, "month"); //13
             *
             * dtA = new Date(2000, 1, 1);
             * dtB = new Date(2000, 1, 8);
             * dateExtender.difference(dtA, dtB, "week"); //1
             *
             * dtA = new Date(2000, 1, 29);
             * dtB = new Date(2000, 2, 1);
             * dateExtender.difference(dtA, dtB, "day"); //1
             *
             * dtA = new Date(2006, 7, 3);
             * dtB = new Date(2006, 7, 11);
             * dateExtender.difference(dtA, dtB, "weekday"); //6
             *
             * dtA = new Date(2000, 11, 31, 23);
             * dtB = new Date(2001, 0, 1, 0);
             * dateExtender.difference(dtA, dtB, "hour"); //1
             *
             * dtA = new Date(2000, 11, 31, 23, 59);
             * dtB = new Date(2001, 0, 1, 0, 0);
             * dateExtender.difference(dtA, dtB, "minute"); //1
             *
             * dtA = new Date(2000, 11, 31, 23, 59, 59);
             * dtB = new Date(2001, 0, 1, 0, 0, 0);
             * dateExtender.difference(dtA, dtB, "second"); //1
             *
             * dtA = new Date(2000, 11, 31, 23, 59, 59, 999);
             * dtB = new Date(2001, 0, 1, 0, 0, 0, 0);
             * dateExtender.difference(dtA, dtB, "millisecond"); //1
             *
             *
             * @param {Date} date1
             * @param {Date} [date2 = new Date()]
             * @param {String} [interval = "day"] the intercal to find the difference of.
             *   <ul>
             *      <li>day | days</li>
             *      <li>weekday | weekdays</li>
             *      <li>year | years</li>
             *      <li>week | weeks</li>
             *      <li>quarter | quarters</li>
             *      <li>months | months</li>
             *      <li>hour | hours</li>
             *      <li>minute | minutes</li>
             *      <li>second | seconds</li>
             *      <li>millisecond | milliseconds</li>
             *  </ul>
             */
            difference: function (/*Date*/date1, /*Date?*/date2, /*String*/interval, utc) {
                date2 = date2 || new Date();
                interval = interval || "day";
                return differenceTransform(interval, date1, date2, utc);
            },

            /**
             * Formats a date to the specidifed format string
             *
             * @example
             *
             * var date = new Date(2006, 7, 11, 0, 55, 12, 345);
             * dateExtender.format(date, "EEEE, MMMM dd, yyyy"); //"Friday, August 11, 2006"
             * dateExtender.format(date, "M/dd/yy"); //"8/11/06"
             * dateExtender.format(date, "E"); //"6"
             * dateExtender.format(date, "h:m a"); //"12:55 AM"
             * dateExtender.format(date, 'h:m:s'); //"12:55:12"
             * dateExtender.format(date, 'h:m:s.SS'); //"12:55:12.35"
             * dateExtender.format(date, 'k:m:s.SS'); //"24:55:12.35"
             * dateExtender.format(date, 'H:m:s.SS'); //"0:55:12.35"
             * dateExtender.format(date, "ddMMyyyy"); //"11082006"
             *
             * @param date the date to format
             * @param {String} format the format of the date composed of the following options
             * <ul>
             *                  <li> G    Era designator    Text    AD</li>
             *                  <li> y    Year    Year    1996; 96</li>
             *                  <li> M    Month in year    Month    July; Jul; 07</li>
             *                  <li> w    Week in year    Number    27</li>
             *                  <li> W    Week in month    Number    2</li>
             *                  <li> D    Day in year    Number    189</li>
             *                  <li> d    Day in month    Number    10</li>
             *                  <li> E    Day in week    Text    Tuesday; Tue</li>
             *                  <li> a    Am/pm marker    Text    PM</li>
             *                  <li> H    Hour in day (0-23)    Number    0</li>
             *                  <li> k    Hour in day (1-24)    Number    24</li>
             *                  <li> K    Hour in am/pm (0-11)    Number    0</li>
             *                  <li> h    Hour in am/pm (1-12)    Number    12</li>
             *                  <li> m    Minute in hour    Number    30</li>
             *                  <li> s    Second in minute    Number    55</li>
             *                  <li> S    Millisecond    Number    978</li>
             *                  <li> z    Time zone    General time zone    Pacific Standard Time; PST; GMT-08:00</li>
             *                  <li> Z    Time zone    RFC 822 time zone    -0800 </li>
             * </ul>
             */
            format: function (date, format, utc) {
                utc = utc || false;
                var fullYear, month, day, d, hour, minute, second, millisecond;
                if (utc) {
                    fullYear = date.getUTCFullYear();
                    month = date.getUTCMonth();
                    day = date.getUTCDay();
                    d = date.getUTCDate();
                    hour = date.getUTCHours();
                    minute = date.getUTCMinutes();
                    second = date.getUTCSeconds();
                    millisecond = date.getUTCMilliseconds();
                } else {
                    fullYear = date.getFullYear();
                    month = date.getMonth();
                    d = date.getDate();
                    day = date.getDay();
                    hour = date.getHours();
                    minute = date.getMinutes();
                    second = date.getSeconds();
                    millisecond = date.getMilliseconds();
                }
                return format.replace(/([A-Za-z])\1*/g, function (match) {
                    var s, pad,
                        c = match.charAt(0),
                        l = match.length;
                    if (c === 'd') {
                        s = "" + d;
                        pad = true;
                    } else if (c === "H" && !s) {
                        s = "" + hour;
                        pad = true;
                    } else if (c === 'm' && !s) {
                        s = "" + minute;
                        pad = true;
                    } else if (c === 's') {
                        if (!s) {
                            s = "" + second;
                        }
                        pad = true;
                    } else if (c === "G") {
                        s = ((l < 4) ? eraAbbr : eraNames)[fullYear < 0 ? 0 : 1];
                    } else if (c === "y") {
                        s = fullYear;
                        if (l > 1) {
                            if (l === 2) {
                                s = _truncate("" + s, 2, true);
                            } else {
                                pad = true;
                            }
                        }
                    } else if (c.toUpperCase() === "Q") {
                        s = ceil((month + 1) / 3);
                        pad = true;
                    } else if (c === "M") {
                        if (l < 3) {
                            s = month + 1;
                            pad = true;
                        } else {
                            s = (l === 3 ? monthAbbr : monthNames)[month];
                        }
                    } else if (c === "w") {
                        s = getWeekOfYear(date, 0, utc);
                        pad = true;
                    } else if (c === "D") {
                        s = getDayOfYear(date, utc);
                        pad = true;
                    } else if (c === "E") {
                        if (l < 3) {
                            s = day + 1;
                            pad = true;
                        } else {
                            s = (l === -3 ? dayAbbr : dayNames)[day];
                        }
                    } else if (c === 'a') {
                        s = (hour < 12) ? 'AM' : 'PM';
                    } else if (c === "h") {
                        s = (hour % 12) || 12;
                        pad = true;
                    } else if (c === "K") {
                        s = (hour % 12);
                        pad = true;
                    } else if (c === "k") {
                        s = hour || 24;
                        pad = true;
                    } else if (c === "S") {
                        s = round(millisecond * pow(10, l - 3));
                        pad = true;
                    } else if (c === "z" || c === "v" || c === "Z") {
                        s = getTimezoneName(date);
                        if ((c === "z" || c === "v") && !s) {
                            l = 4;
                        }
                        if (!s || c === "Z") {
                            var offset = date.getTimezoneOffset();
                            var tz = [
                                (offset >= 0 ? "-" : "+"),
                                _pad(floor(abs(offset) / 60), 2, "0"),
                                _pad(abs(offset) % 60, 2, "0")
                            ];
                            if (l === 4) {
                                tz.splice(0, 0, "GMT");
                                tz.splice(3, 0, ":");
                            }
                            s = tz.join("");
                        }
                    } else {
                        s = match;
                    }
                    if (pad) {
                        s = _pad(s, l, '0');
                    }
                    return s;
                });
            }

        };

        var numberDate = {};

        function addInterval(interval) {
            numberDate[interval + "sFromNow"] = function (val) {
                return date.add(new Date(), interval, val);
            };
            numberDate[interval + "sAgo"] = function (val) {
                return date.add(new Date(), interval, -val);
            };
        }

        var intervals = ["year", "month", "day", "hour", "minute", "second"];
        for (var i = 0, l = intervals.length; i < l; i++) {
            addInterval(intervals[i]);
        }

        var stringDate = {

            parseDate: function (dateStr, format) {
                if (!format) {
                    throw new Error('format required when calling dateExtender.parse');
                }
                var tokens = [], regexp = buildDateEXP(format, tokens),
                    re = new RegExp("^" + regexp + "$", "i"),
                    match = re.exec(dateStr);
                if (!match) {
                    return null;
                } // null
                var result = [1970, 0, 1, 0, 0, 0, 0], // will get converted to a Date at the end
                    amPm = "",
                    valid = every(match, function (v, i) {
                        if (i) {
                            var token = tokens[i - 1];
                            var l = token.length, type = token.charAt(0);
                            if (type === 'y') {
                                if (v < 100) {
                                    v = parseInt(v, 10);
                                    //choose century to apply, according to a sliding window
                                    //of 80 years before and 20 years after present year
                                    var year = '' + new Date().getFullYear(),
                                        century = year.substring(0, 2) * 100,
                                        cutoff = min(year.substring(2, 4) + 20, 99);
                                    result[0] = (v < cutoff) ? century + v : century - 100 + v;
                                } else {
                                    result[0] = v;
                                }
                            } else if (type === "M") {
                                if (l > 2) {
                                    var months = monthNames, j, k;
                                    if (l === 3) {
                                        months = monthAbbr;
                                    }
                                    //Tolerate abbreviating period in month part
                                    //Case-insensitive comparison
                                    v = v.replace(".", "").toLowerCase();
                                    var contains = false;
                                    for (j = 0, k = months.length; j < k && !contains; j++) {
                                        var s = months[j].replace(".", "").toLocaleLowerCase();
                                        if (s === v) {
                                            v = j;
                                            contains = true;
                                        }
                                    }
                                    if (!contains) {
                                        return false;
                                    }
                                } else {
                                    v--;
                                }
                                result[1] = v;
                            } else if (type === "E" || type === "e") {
                                var days = dayNames;
                                if (l === 3) {
                                    days = dayAbbr;
                                }
                                //Case-insensitive comparison
                                v = v.toLowerCase();
                                days = array.map(days, function (d) {
                                    return d.toLowerCase();
                                });
                                var d = array.indexOf(days, v);
                                if (d === -1) {
                                    v = parseInt(v, 10);
                                    if (isNaN(v) || v > days.length) {
                                        return false;
                                    }
                                } else {
                                    v = d;
                                }
                            } else if (type === 'D' || type === "d") {
                                if (type === "D") {
                                    result[1] = 0;
                                }
                                result[2] = v;
                            } else if (type === "a") {
                                var am = "am";
                                var pm = "pm";
                                var period = /\./g;
                                v = v.replace(period, '').toLowerCase();
                                // we might not have seen the hours field yet, so store the state and apply hour change later
                                amPm = (v === pm) ? 'p' : (v === am) ? 'a' : '';
                            } else if (type === "k" || type === "h" || type === "H" || type === "K") {
                                if (type === "k" && (+v) === 24) {
                                    v = 0;
                                }
                                result[3] = v;
                            } else if (type === "m") {
                                result[4] = v;
                            } else if (type === "s") {
                                result[5] = v;
                            } else if (type === "S") {
                                result[6] = v;
                            }
                        }
                        return true;
                    });
                if (valid) {
                    var hours = +result[3];
                    //account for am/pm
                    if (amPm === 'p' && hours < 12) {
                        result[3] = hours + 12; //e.g., 3pm -> 15
                    } else if (amPm === 'a' && hours === 12) {
                        result[3] = 0; //12am -> 0
                    }
                    var dateObject = new Date(result[0], result[1], result[2], result[3], result[4], result[5], result[6]); // Date
                    var dateToken = (array.indexOf(tokens, 'd') !== -1),
                        monthToken = (array.indexOf(tokens, 'M') !== -1),
                        month = result[1],
                        day = result[2],
                        dateMonth = dateObject.getMonth(),
                        dateDay = dateObject.getDate();
                    if ((monthToken && dateMonth > month) || (dateToken && dateDay > day)) {
                        return null;
                    }
                    return dateObject; // Date
                } else {
                    return null;
                }
            }
        };


        var ret = extended.define(is.isDate, date).define(is.isString, stringDate).define(is.isNumber, numberDate);
        for (i in date) {
            if (date.hasOwnProperty(i)) {
                ret[i] = date[i];
            }
        }

        for (i in stringDate) {
            if (stringDate.hasOwnProperty(i)) {
                ret[i] = stringDate[i];
            }
        }
        for (i in numberDate) {
            if (numberDate.hasOwnProperty(i)) {
                ret[i] = numberDate[i];
            }
        }
        return ret;
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineDate(require("extended"), require("is-extended"), require("array-extended"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended", "is-extended", "array-extended"], function (extended, is, arr) {
            return defineDate(extended, is, arr);
        });
    } else {
        this.dateExtended = defineDate(this.extended, this.isExtended, this.arrayExtended);
    }

}).call(this);







},{"array-extended":52,"extended":56,"is-extended":66}],54:[function(require,module,exports){
(function () {

    /**
     * @projectName declare
     * @github http://github.com/doug-martin/declare.js
     * @header
     *
     * Declare is a library designed to allow writing object oriented code the same way in both the browser and node.js.
     *
     * ##Installation
     *
     * `npm install declare.js`
     *
     * Or [download the source](https://raw.github.com/doug-martin/declare.js/master/declare.js) ([minified](https://raw.github.com/doug-martin/declare.js/master/declare-min.js))
     *
     * ###Requirejs
     *
     * To use with requirejs place the `declare` source in the root scripts directory
     *
     * ```
     *
     * define(["declare"], function(declare){
     *      return declare({
     *          instance : {
     *              hello : function(){
     *                  return "world";
     *              }
     *          }
     *      });
     * });
     *
     * ```
     *
     *
     * ##Usage
     *
     * declare.js provides
     *
     * Class methods
     *
     * * `as(module | object, name)` : exports the object to module or the object with the name
     * * `mixin(mixin)` : mixes in an object but does not inherit directly from the object. **Note** this does not return a new class but changes the original class.
     * * `extend(proto)` : extend a class with the given properties. A shortcut to `declare(Super, {})`;
     *
     * Instance methods
     *
     * * `_super(arguments)`: calls the super of the current method, you can pass in either the argments object or an array with arguments you want passed to super
     * * `_getSuper()`: returns a this methods direct super.
     * * `_static` : use to reference class properties and methods.
     * * `get(prop)` : gets a property invoking the getter if it exists otherwise it just returns the named property on the object.
     * * `set(prop, val)` : sets a property invoking the setter if it exists otherwise it just sets the named property on the object.
     *
     *
     * ###Declaring a new Class
     *
     * Creating a new class with declare is easy!
     *
     * ```
     *
     * var Mammal = declare({
     *      //define your instance methods and properties
     *      instance : {
     *
     *          //will be called whenever a new instance is created
     *          constructor: function(options) {
     *              options = options || {};
     *              this._super(arguments);
     *              this._type = options.type || "mammal";
     *          },
     *
     *          speak : function() {
     *              return  "A mammal of type " + this._type + " sounds like";
     *          },
     *
     *          //Define your getters
     *          getters : {
     *
     *              //can be accessed by using the get method. (mammal.get("type"))
     *              type : function() {
     *                  return this._type;
     *              }
     *          },
     *
     *           //Define your setters
     *          setters : {
     *
     *                //can be accessed by using the set method. (mammal.set("type", "mammalType"))
     *              type : function(t) {
     *                  this._type = t;
     *              }
     *          }
     *      },
     *
     *      //Define your static methods
     *      static : {
     *
     *          //Mammal.soundOff(); //"Im a mammal!!"
     *          soundOff : function() {
     *              return "Im a mammal!!";
     *          }
     *      }
     * });
     *
     *
     * ```
     *
     * You can use Mammal just like you would any other class.
     *
     * ```
     * Mammal.soundOff("Im a mammal!!");
     *
     * var myMammal = new Mammal({type : "mymammal"});
     * myMammal.speak(); // "A mammal of type mymammal sounds like"
     * myMammal.get("type"); //"mymammal"
     * myMammal.set("type", "mammal");
     * myMammal.get("type"); //"mammal"
     *
     *
     * ```
     *
     * ###Extending a class
     *
     * If you want to just extend a single class use the .extend method.
     *
     * ```
     *
     * var Wolf = Mammal.extend({
     *
     *   //define your instance method
     *   instance: {
     *
     *        //You can override super constructors just be sure to call `_super`
     *       constructor: function(options) {
     *          options = options || {};
     *          this._super(arguments); //call our super constructor.
     *          this._sound = "growl";
     *          this._color = options.color || "grey";
     *      },
     *
     *      //override Mammals `speak` method by appending our own data to it.
     *      speak : function() {
     *          return this._super(arguments) + " a " + this._sound;
     *      },
     *
     *      //add new getters for sound and color
     *      getters : {
     *
     *           //new Wolf().get("type")
     *           //notice color is read only as we did not define a setter
     *          color : function() {
     *              return this._color;
     *          },
     *
     *          //new Wolf().get("sound")
     *          sound : function() {
     *              return this._sound;
     *          }
     *      },
     *
     *      setters : {
     *
     *          //new Wolf().set("sound", "howl")
     *          sound : function(s) {
     *              this._sound = s;
     *          }
     *      }
     *
     *  },
     *
     *  static : {
     *
     *      //You can override super static methods also! And you can still use _super
     *      soundOff : function() {
     *          //You can even call super in your statics!!!
     *          //should return "I'm a mammal!! that growls"
     *          return this._super(arguments) + " that growls";
     *      }
     *  }
     * });
     *
     * Wolf.soundOff(); //Im a mammal!! that growls
     *
     * var myWolf = new Wolf();
     * myWolf instanceof Mammal //true
     * myWolf instanceof Wolf //true
     *
     * ```
     *
     * You can also extend a class by using the declare method and just pass in the super class.
     *
     * ```
     * //Typical hierarchical inheritance
     * // Mammal->Wolf->Dog
     * var Dog = declare(Wolf, {
     *    instance: {
     *        constructor: function(options) {
     *            options = options || {};
     *            this._super(arguments);
     *            //override Wolfs initialization of sound to woof.
     *            this._sound = "woof";
     *
     *        },
     *
     *        speak : function() {
     *            //Should return "A mammal of type mammal sounds like a growl thats domesticated"
     *            return this._super(arguments) + " thats domesticated";
     *        }
     *    },
     *
     *    static : {
     *        soundOff : function() {
     *            //should return "I'm a mammal!! that growls but now barks"
     *            return this._super(arguments) + " but now barks";
     *        }
     *    }
     * });
     *
     * Dog.soundOff(); //Im a mammal!! that growls but now barks
     *
     * var myDog = new Dog();
     * myDog instanceof Mammal //true
     * myDog instanceof Wolf //true
     * myDog instanceof Dog //true
     *
     *
     * //Notice you still get the extend method.
     *
     * // Mammal->Wolf->Dog->Breed
     * var Breed = Dog.extend({
     *    instance: {
     *
     *        //initialize outside of constructor
     *        _pitch : "high",
     *
     *        constructor: function(options) {
     *            options = options || {};
     *            this._super(arguments);
     *            this.breed = options.breed || "lab";
     *        },
     *
     *        speak : function() {
     *            //Should return "A mammal of type mammal sounds like a
     *            //growl thats domesticated with a high pitch!"
     *            return this._super(arguments) + " with a " + this._pitch + " pitch!";
     *        },
     *
     *        getters : {
     *            pitch : function() {
     *                return this._pitch;
     *            }
     *        }
     *    },
     *
     *    static : {
     *        soundOff : function() {
     *            //should return "I'M A MAMMAL!! THAT GROWLS BUT NOW BARKS!"
     *            return this._super(arguments).toUpperCase() + "!";
     *        }
     *    }
     * });
     *
     *
     * Breed.soundOff()//"IM A MAMMAL!! THAT GROWLS BUT NOW BARKS!"
     *
     * var myBreed = new Breed({color : "gold", type : "lab"}),
     * myBreed instanceof Dog //true
     * myBreed instanceof Wolf //true
     * myBreed instanceof Mammal //true
     * myBreed.speak() //"A mammal of type lab sounds like a woof thats domesticated with a high pitch!"
     * myBreed.get("type") //"lab"
     * myBreed.get("color") //"gold"
     * myBreed.get("sound")" //"woof"
     * ```
     *
     * ###Multiple Inheritance / Mixins
     *
     * declare also allows the use of multiple super classes.
     * This is useful if you have generic classes that provide functionality but shouldnt be used on their own.
     *
     * Lets declare a mixin that allows us to watch for property changes.
     *
     * ```
     * //Notice that we set up the functions outside of declare because we can reuse them
     *
     * function _set(prop, val) {
     *     //get the old value
     *     var oldVal = this.get(prop);
     *     //call super to actually set the property
     *     var ret = this._super(arguments);
     *     //call our handlers
     *     this.__callHandlers(prop, oldVal, val);
     *     return ret;
     * }
     *
     * function _callHandlers(prop, oldVal, newVal) {
     *    //get our handlers for the property
     *     var handlers = this.__watchers[prop], l;
     *     //if the handlers exist and their length does not equal 0 then we call loop through them
     *     if (handlers && (l = handlers.length) !== 0) {
     *         for (var i = 0; i < l; i++) {
     *             //call the handler
     *             handlers[i].call(null, prop, oldVal, newVal);
     *         }
     *     }
     * }
     *
     *
     * //the watch function
     * function _watch(prop, handler) {
     *     if ("function" !== typeof handler) {
     *         //if its not a function then its an invalid handler
     *         throw new TypeError("Invalid handler.");
     *     }
     *     if (!this.__watchers[prop]) {
     *         //create the watchers if it doesnt exist
     *         this.__watchers[prop] = [handler];
     *     } else {
     *         //otherwise just add it to the handlers array
     *         this.__watchers[prop].push(handler);
     *     }
     * }
     *
     * function _unwatch(prop, handler) {
     *     if ("function" !== typeof handler) {
     *         throw new TypeError("Invalid handler.");
     *     }
     *     var handlers = this.__watchers[prop], index;
     *     if (handlers && (index = handlers.indexOf(handler)) !== -1) {
     *        //remove the handler if it is found
     *         handlers.splice(index, 1);
     *     }
     * }
     *
     * declare({
     *     instance:{
     *         constructor:function () {
     *             this._super(arguments);
     *             //set up our watchers
     *             this.__watchers = {};
     *         },
     *
     *         //override the default set function so we can watch values
     *         "set":_set,
     *         //set up our callhandlers function
     *         __callHandlers:_callHandlers,
     *         //add the watch function
     *         watch:_watch,
     *         //add the unwatch function
     *         unwatch:_unwatch
     *     },
     *
     *     "static":{
     *
     *         init:function () {
     *             this._super(arguments);
     *             this.__watchers = {};
     *         },
     *         //override the default set function so we can watch values
     *         "set":_set,
     *         //set our callHandlers function
     *         __callHandlers:_callHandlers,
     *         //add the watch
     *         watch:_watch,
     *         //add the unwatch function
     *         unwatch:_unwatch
     *     }
     * })
     *
     * ```
     *
     * Now lets use the mixin
     *
     * ```
     * var WatchDog = declare([Dog, WatchMixin]);
     *
     * var watchDog = new WatchDog();
     * //create our handler
     * function watch(id, oldVal, newVal) {
     *     console.log("watchdog's %s was %s, now %s", id, oldVal, newVal);
     * }
     *
     * //watch for property changes
     * watchDog.watch("type", watch);
     * watchDog.watch("color", watch);
     * watchDog.watch("sound", watch);
     *
     * //now set the properties each handler will be called
     * watchDog.set("type", "newDog");
     * watchDog.set("color", "newColor");
     * watchDog.set("sound", "newSound");
     *
     *
     * //unwatch the property changes
     * watchDog.unwatch("type", watch);
     * watchDog.unwatch("color", watch);
     * watchDog.unwatch("sound", watch);
     *
     * //no handlers will be called this time
     * watchDog.set("type", "newDog");
     * watchDog.set("color", "newColor");
     * watchDog.set("sound", "newSound");
     *
     *
     * ```
     *
     * ###Accessing static methods and properties witin an instance.
     *
     * To access static properties on an instance use the `_static` property which is a reference to your constructor.
     *
     * For example if your in your constructor and you want to have configurable default values.
     *
     * ```
     * consturctor : function constructor(opts){
     *     this.opts = opts || {};
     *     this._type = opts.type || this._static.DEFAULT_TYPE;
     * }
     * ```
     *
     *
     *
     * ###Creating a new instance of within an instance.
     *
     * Often times you want to create a new instance of an object within an instance. If your subclassed however you cannot return a new instance of the parent class as it will not be the right sub class. `declare` provides a way around this by setting the `_static` property on each isntance of the class.
     *
     * Lets add a reproduce method `Mammal`
     *
     * ```
     * reproduce : function(options){
     *     return new this._static(options);
     * }
     * ```
     *
     * Now in each subclass you can call reproduce and get the proper type.
     *
     * ```
     * var myDog = new Dog();
     * var myDogsChild = myDog.reproduce();
     *
     * myDogsChild instanceof Dog; //true
     * ```
     *
     * ###Using the `as`
     *
     * `declare` also provides an `as` method which allows you to add your class to an object or if your using node.js you can pass in `module` and the class will be exported as the module.
     *
     * ```
     * var animals = {};
     *
     * Mammal.as(animals, "Dog");
     * Wolf.as(animals, "Wolf");
     * Dog.as(animals, "Dog");
     * Breed.as(animals, "Breed");
     *
     * var myDog = new animals.Dog();
     *
     * ```
     *
     * Or in node
     *
     * ```
     * Mammal.as(exports, "Dog");
     * Wolf.as(exports, "Wolf");
     * Dog.as(exports, "Dog");
     * Breed.as(exports, "Breed");
     *
     * ```
     *
     * To export a class as the `module` in node
     *
     * ```
     * Mammal.as(module);
     * ```
     *
     *
     */
    function createDeclared() {
        var arraySlice = Array.prototype.slice, classCounter = 0, Base, forceNew = new Function();

        var SUPER_REGEXP = /(super)/g;

        function argsToArray(args, slice) {
            slice = slice || 0;
            return arraySlice.call(args, slice);
        }

        function isArray(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        }

        function isObject(obj) {
            var undef;
            return obj !== null && obj !== undef && typeof obj === "object";
        }

        function isHash(obj) {
            var ret = isObject(obj);
            return ret && obj.constructor === Object;
        }

        var isArguments = function _isArguments(object) {
            return Object.prototype.toString.call(object) === '[object Arguments]';
        };

        if (!isArguments(arguments)) {
            isArguments = function _isArguments(obj) {
                return !!(obj && obj.hasOwnProperty("callee"));
            };
        }

        function indexOf(arr, item) {
            if (arr && arr.length) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    if (arr[i] === item) {
                        return i;
                    }
                }
            }
            return -1;
        }

        function merge(target, source, exclude) {
            var name, s;
            for (name in source) {
                if (source.hasOwnProperty(name) && indexOf(exclude, name) === -1) {
                    s = source[name];
                    if (!(name in target) || (target[name] !== s)) {
                        target[name] = s;
                    }
                }
            }
            return target;
        }

        function callSuper(args, a) {
            var meta = this.__meta,
                supers = meta.supers,
                l = supers.length, superMeta = meta.superMeta, pos = superMeta.pos;
            if (l > pos) {
                args = !args ? [] : (!isArguments(args) && !isArray(args)) ? [args] : args;
                var name = superMeta.name, f = superMeta.f, m;
                do {
                    m = supers[pos][name];
                    if ("function" === typeof m && (m = m._f || m) !== f) {
                        superMeta.pos = 1 + pos;
                        return m.apply(this, args);
                    }
                } while (l > ++pos);
            }

            return null;
        }

        function getSuper() {
            var meta = this.__meta,
                supers = meta.supers,
                l = supers.length, superMeta = meta.superMeta, pos = superMeta.pos;
            if (l > pos) {
                var name = superMeta.name, f = superMeta.f, m;
                do {
                    m = supers[pos][name];
                    if ("function" === typeof m && (m = m._f || m) !== f) {
                        superMeta.pos = 1 + pos;
                        return m.bind(this);
                    }
                } while (l > ++pos);
            }
            return null;
        }

        function getter(name) {
            var getters = this.__getters__;
            if (getters.hasOwnProperty(name)) {
                return getters[name].apply(this);
            } else {
                return this[name];
            }
        }

        function setter(name, val) {
            var setters = this.__setters__;
            if (isHash(name)) {
                for (var i in name) {
                    var prop = name[i];
                    if (setters.hasOwnProperty(i)) {
                        setters[name].call(this, prop);
                    } else {
                        this[i] = prop;
                    }
                }
            } else {
                if (setters.hasOwnProperty(name)) {
                    return setters[name].apply(this, argsToArray(arguments, 1));
                } else {
                    return this[name] = val;
                }
            }
        }


        function defaultFunction() {
            var meta = this.__meta || {},
                supers = meta.supers,
                l = supers.length, superMeta = meta.superMeta, pos = superMeta.pos;
            if (l > pos) {
                var name = superMeta.name, f = superMeta.f, m;
                do {
                    m = supers[pos][name];
                    if ("function" === typeof m && (m = m._f || m) !== f) {
                        superMeta.pos = 1 + pos;
                        return m.apply(this, arguments);
                    }
                } while (l > ++pos);
            }
            return null;
        }


        function functionWrapper(f, name) {
            if (f.toString().match(SUPER_REGEXP)) {
                var wrapper = function wrapper() {
                    var ret, meta = this.__meta || {};
                    var orig = meta.superMeta;
                    meta.superMeta = {f: f, pos: 0, name: name};
                    switch (arguments.length) {
                    case 0:
                        ret = f.call(this);
                        break;
                    case 1:
                        ret = f.call(this, arguments[0]);
                        break;
                    case 2:
                        ret = f.call(this, arguments[0], arguments[1]);
                        break;

                    case 3:
                        ret = f.call(this, arguments[0], arguments[1], arguments[2]);
                        break;
                    default:
                        ret = f.apply(this, arguments);
                    }
                    meta.superMeta = orig;
                    return ret;
                };
                wrapper._f = f;
                return wrapper;
            } else {
                f._f = f;
                return f;
            }
        }

        function defineMixinProps(child, proto) {

            var operations = proto.setters || {}, __setters = child.__setters__, __getters = child.__getters__;
            for (var i in operations) {
                if (!__setters.hasOwnProperty(i)) {  //make sure that the setter isnt already there
                    __setters[i] = operations[i];
                }
            }
            operations = proto.getters || {};
            for (i in operations) {
                if (!__getters.hasOwnProperty(i)) {  //make sure that the setter isnt already there
                    __getters[i] = operations[i];
                }
            }
            for (var j in proto) {
                if (j !== "getters" && j !== "setters") {
                    var p = proto[j];
                    if ("function" === typeof p) {
                        if (!child.hasOwnProperty(j)) {
                            child[j] = functionWrapper(defaultFunction, j);
                        }
                    } else {
                        child[j] = p;
                    }
                }
            }
        }

        function mixin() {
            var args = argsToArray(arguments), l = args.length;
            var child = this.prototype;
            var childMeta = child.__meta, thisMeta = this.__meta, bases = child.__meta.bases, staticBases = bases.slice(),
                staticSupers = thisMeta.supers || [], supers = childMeta.supers || [];
            for (var i = 0; i < l; i++) {
                var m = args[i], mProto = m.prototype;
                var protoMeta = mProto.__meta, meta = m.__meta;
                !protoMeta && (protoMeta = (mProto.__meta = {proto: mProto || {}}));
                !meta && (meta = (m.__meta = {proto: m.__proto__ || {}}));
                defineMixinProps(child, protoMeta.proto || {});
                defineMixinProps(this, meta.proto || {});
                //copy the bases for static,

                mixinSupers(m.prototype, supers, bases);
                mixinSupers(m, staticSupers, staticBases);
            }
            return this;
        }

        function mixinSupers(sup, arr, bases) {
            var meta = sup.__meta;
            !meta && (meta = (sup.__meta = {}));
            var unique = sup.__meta.unique;
            !unique && (meta.unique = "declare" + ++classCounter);
            //check it we already have this super mixed into our prototype chain
            //if true then we have already looped their supers!
            if (indexOf(bases, unique) === -1) {
                //add their id to our bases
                bases.push(unique);
                var supers = sup.__meta.supers || [], i = supers.length - 1 || 0;
                while (i >= 0) {
                    mixinSupers(supers[i--], arr, bases);
                }
                arr.unshift(sup);
            }
        }

        function defineProps(child, proto) {
            var operations = proto.setters,
                __setters = child.__setters__,
                __getters = child.__getters__;
            if (operations) {
                for (var i in operations) {
                    __setters[i] = operations[i];
                }
            }
            operations = proto.getters || {};
            if (operations) {
                for (i in operations) {
                    __getters[i] = operations[i];
                }
            }
            for (i in proto) {
                if (i != "getters" && i != "setters") {
                    var f = proto[i];
                    if ("function" === typeof f) {
                        var meta = f.__meta || {};
                        if (!meta.isConstructor) {
                            child[i] = functionWrapper(f, i);
                        } else {
                            child[i] = f;
                        }
                    } else {
                        child[i] = f;
                    }
                }
            }

        }

        function _export(obj, name) {
            if (obj && name) {
                obj[name] = this;
            } else {
                obj.exports = obj = this;
            }
            return this;
        }

        function extend(proto) {
            return declare(this, proto);
        }

        function getNew(ctor) {
            // create object with correct prototype using a do-nothing
            // constructor
            forceNew.prototype = ctor.prototype;
            var t = new forceNew();
            forceNew.prototype = null;	// clean up
            return t;
        }


        function __declare(child, sup, proto) {
            var childProto = {}, supers = [];
            var unique = "declare" + ++classCounter, bases = [], staticBases = [];
            var instanceSupers = [], staticSupers = [];
            var meta = {
                supers: instanceSupers,
                unique: unique,
                bases: bases,
                superMeta: {
                    f: null,
                    pos: 0,
                    name: null
                }
            };
            var childMeta = {
                supers: staticSupers,
                unique: unique,
                bases: staticBases,
                isConstructor: true,
                superMeta: {
                    f: null,
                    pos: 0,
                    name: null
                }
            };

            if (isHash(sup) && !proto) {
                proto = sup;
                sup = Base;
            }

            if ("function" === typeof sup || isArray(sup)) {
                supers = isArray(sup) ? sup : [sup];
                sup = supers.shift();
                child.__meta = childMeta;
                childProto = getNew(sup);
                childProto.__meta = meta;
                childProto.__getters__ = merge({}, childProto.__getters__ || {});
                childProto.__setters__ = merge({}, childProto.__setters__ || {});
                child.__getters__ = merge({}, child.__getters__ || {});
                child.__setters__ = merge({}, child.__setters__ || {});
                mixinSupers(sup.prototype, instanceSupers, bases);
                mixinSupers(sup, staticSupers, staticBases);
            } else {
                child.__meta = childMeta;
                childProto.__meta = meta;
                childProto.__getters__ = childProto.__getters__ || {};
                childProto.__setters__ = childProto.__setters__ || {};
                child.__getters__ = child.__getters__ || {};
                child.__setters__ = child.__setters__ || {};
            }
            child.prototype = childProto;
            if (proto) {
                var instance = meta.proto = proto.instance || {};
                var stat = childMeta.proto = proto.static || {};
                stat.init = stat.init || defaultFunction;
                defineProps(childProto, instance);
                defineProps(child, stat);
                if (!instance.hasOwnProperty("constructor")) {
                    childProto.constructor = instance.constructor = functionWrapper(defaultFunction, "constructor");
                } else {
                    childProto.constructor = functionWrapper(instance.constructor, "constructor");
                }
            } else {
                meta.proto = {};
                childMeta.proto = {};
                child.init = functionWrapper(defaultFunction, "init");
                childProto.constructor = functionWrapper(defaultFunction, "constructor");
            }
            if (supers.length) {
                mixin.apply(child, supers);
            }
            if (sup) {
                //do this so we mixin our super methods directly but do not ov
                merge(child, merge(merge({}, sup), child));
            }
            childProto._super = child._super = callSuper;
            childProto._getSuper = child._getSuper = getSuper;
            childProto._static = child;
        }

        function declare(sup, proto) {
            function declared() {
                switch (arguments.length) {
                case 0:
                    this.constructor.call(this);
                    break;
                case 1:
                    this.constructor.call(this, arguments[0]);
                    break;
                case 2:
                    this.constructor.call(this, arguments[0], arguments[1]);
                    break;
                case 3:
                    this.constructor.call(this, arguments[0], arguments[1], arguments[2]);
                    break;
                default:
                    this.constructor.apply(this, arguments);
                }
            }

            __declare(declared, sup, proto);
            return declared.init() || declared;
        }

        function singleton(sup, proto) {
            var retInstance;

            function declaredSingleton() {
                if (!retInstance) {
                    this.constructor.apply(this, arguments);
                    retInstance = this;
                }
                return retInstance;
            }

            __declare(declaredSingleton, sup, proto);
            return  declaredSingleton.init() || declaredSingleton;
        }

        Base = declare({
            instance: {
                "get": getter,
                "set": setter
            },

            "static": {
                "get": getter,
                "set": setter,
                mixin: mixin,
                extend: extend,
                as: _export
            }
        });

        declare.singleton = singleton;
        return declare;
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = createDeclared();
        }
    } else if ("function" === typeof define && define.amd) {
        define(createDeclared);
    } else {
        this.declare = createDeclared();
    }
}());




},{}],55:[function(require,module,exports){
module.exports = require("./declare.js");
},{"./declare.js":54}],56:[function(require,module,exports){
(function () {
    "use strict";
    /*global extender is, dateExtended*/

    function defineExtended(extender) {


        var merge = (function merger() {
            function _merge(target, source) {
                var name, s;
                for (name in source) {
                    if (source.hasOwnProperty(name)) {
                        s = source[name];
                        if (!(name in target) || (target[name] !== s)) {
                            target[name] = s;
                        }
                    }
                }
                return target;
            }

            return function merge(obj) {
                if (!obj) {
                    obj = {};
                }
                for (var i = 1, l = arguments.length; i < l; i++) {
                    _merge(obj, arguments[i]);
                }
                return obj; // Object
            };
        }());

        function getExtended() {

            var loaded = {};


            //getInitial instance;
            var extended = extender.define();
            extended.expose({
                register: function register(alias, extendWith) {
                    if (!extendWith) {
                        extendWith = alias;
                        alias = null;
                    }
                    var type = typeof extendWith;
                    if (alias) {
                        extended[alias] = extendWith;
                    } else if (extendWith && type === "function") {
                        extended.extend(extendWith);
                    } else if (type === "object") {
                        extended.expose(extendWith);
                    } else {
                        throw new TypeError("extended.register must be called with an extender function");
                    }
                    return extended;
                },

                define: function () {
                    return extender.define.apply(extender, arguments);
                }
            });

            return extended;
        }

        function extended() {
            return getExtended();
        }

        extended.define = function define() {
            return extender.define.apply(extender, arguments);
        };

        return extended;
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineExtended(require("extender"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extender"], function (extender) {
            return defineExtended(extender);
        });
    } else {
        this.extended = defineExtended(this.extender);
    }

}).call(this);







},{"extender":58}],57:[function(require,module,exports){
(function () {
    /*jshint strict:false*/


    /**
     *
     * @projectName extender
     * @github http://github.com/doug-martin/extender
     * @header
     * [![build status](https://secure.travis-ci.org/doug-martin/extender.png)](http://travis-ci.org/doug-martin/extender)
     * # Extender
     *
     * `extender` is a library that helps in making chainable APIs, by creating a function that accepts different values and returns an object decorated with functions based on the type.
     *
     * ## Why Is Extender Different?
     *
     * Extender is different than normal chaining because is does more than return `this`. It decorates your values in a type safe manner.
     *
     * For example if you return an array from a string based method then the returned value will be decorated with array methods and not the string methods. This allow you as the developer to focus on your API and not worrying about how to properly build and connect your API.
     *
     *
     * ## Installation
     *
     * ```
     * npm install extender
     * ```
     *
     * Or [download the source](https://raw.github.com/doug-martin/extender/master/extender.js) ([minified](https://raw.github.com/doug-martin/extender/master/extender-min.js))
     *
     * **Note** `extender` depends on [`declare.js`](http://doug-martin.github.com/declare.js/).
     *
     * ### Requirejs
     *
     * To use with requirejs place the `extend` source in the root scripts directory
     *
     * ```javascript
     *
     * define(["extender"], function(extender){
     * });
     *
     * ```
     *
     *
     * ## Usage
     *
     * **`extender.define(tester, decorations)`**
     *
     * To create your own extender call the `extender.define` function.
     *
     * This function accepts an optional tester which is used to determine a value should be decorated with the specified `decorations`
     *
     * ```javascript
     * function isString(obj) {
     *     return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
     * }
     *
     *
     * var myExtender = extender.define(isString, {
     *		multiply: function (str, times) {
     *			var ret = str;
     *			for (var i = 1; i < times; i++) {
     *				ret += str;
     *			}
     *			return ret;
     *		},
     *		toArray: function (str, delim) {
     *			delim = delim || "";
     *			return str.split(delim);
     *		}
     *	});
     *
     * myExtender("hello").multiply(2).value(); //hellohello
     *
     * ```
     *
     * If you do not specify a tester function and just pass in an object of `functions` then all values passed in will be decorated with methods.
     *
     * ```javascript
     *
     * function isUndefined(obj) {
     *     var undef;
     *     return obj === undef;
     * }
     *
     * function isUndefinedOrNull(obj) {
     *	var undef;
     *     return obj === undef || obj === null;
     * }
     *
     * function isArray(obj) {
     *     return Object.prototype.toString.call(obj) === "[object Array]";
     * }
     *
     * function isBoolean(obj) {
     *     var undef, type = typeof obj;
     *     return !isUndefinedOrNull(obj) && type === "boolean" || type === "Boolean";
     * }
     *
     * function isString(obj) {
     *     return !isUndefinedOrNull(obj) && (typeof obj === "string" || obj instanceof String);
     * }
     *
     * var myExtender = extender.define({
     *	isUndefined : isUndefined,
     *	isUndefinedOrNull : isUndefinedOrNull,
     *	isArray : isArray,
     *	isBoolean : isBoolean,
     *	isString : isString
     * });
     *
     * ```
     *
     * To use
     *
     * ```
     * var undef;
     * myExtender("hello").isUndefined().value(); //false
     * myExtender(undef).isUndefined().value(); //true
     * ```
     *
     * You can also chain extenders so that they accept multiple types and decorates accordingly.
     *
     * ```javascript
     * myExtender
     *     .define(isArray, {
     *		pluck: function (arr, m) {
     *			var ret = [];
     *			for (var i = 0, l = arr.length; i < l; i++) {
     *				ret.push(arr[i][m]);
     *			}
     *			return ret;
     *		}
     *	})
     *     .define(isBoolean, {
     *		invert: function (val) {
     *			return !val;
     *		}
     *	});
     *
     * myExtender([{a: "a"},{a: "b"},{a: "c"}]).pluck("a").value(); //["a", "b", "c"]
     * myExtender("I love javascript!").toArray(/\s+/).pluck("0"); //["I", "l", "j"]
     *
     * ```
     *
     * Notice that we reuse the same extender as defined above.
     *
     * **Return Values**
     *
     * When creating an extender if you return a value from one of the decoration functions then that value will also be decorated. If you do not return any values then the extender will be returned.
     *
     * **Default decoration methods**
     *
     * By default every value passed into an extender is decorated with the following methods.
     *
     * * `value` : The value this extender represents.
     * * `eq(otherValue)` : Tests strict equality of the currently represented value to the `otherValue`
     * * `neq(oterValue)` : Tests strict inequality of the currently represented value.
     * * `print` : logs the current value to the console.
     *
     * **Extender initialization**
     *
     * When creating an extender you can also specify a constructor which will be invoked with the current value.
     *
     * ```javascript
     * myExtender.define(isString, {
     *	constructor : function(val){
     *     //set our value to the string trimmed
     *		this._value = val.trimRight().trimLeft();
     *	}
     * });
     * ```
     *
     * **`noWrap`**
     *
     * `extender` also allows you to specify methods that should not have the value wrapped providing a cleaner exit function other than `value()`.
     *
     * For example suppose you have an API that allows you to build a validator, rather than forcing the user to invoke the `value` method you could add a method called `validator` which makes more syntactic sense.
     *
     * ```
     *
     * var myValidator = extender.define({
     *     //chainable validation methods
     *     //...
     *     //end chainable validation methods
     *
     *     noWrap : {
     *         validator : function(){
     *             //return your validator
     *         }
     *     }
     * });
     *
     * myValidator().isNotNull().isEmailAddress().validator(); //now you dont need to call .value()
     *
     *
     * ```
     * **`extender.extend(extendr)`**
     *
     * You may also compose extenders through the use of `extender.extend(extender)`, which will return an entirely new extender that is the composition of extenders.
     *
     * Suppose you have the following two extenders.
     *
     * ```javascript
     * var myExtender = extender
     *        .define({
     *            isFunction: is.function,
     *            isNumber: is.number,
     *            isString: is.string,
     *            isDate: is.date,
     *            isArray: is.array,
     *            isBoolean: is.boolean,
     *            isUndefined: is.undefined,
     *            isDefined: is.defined,
     *            isUndefinedOrNull: is.undefinedOrNull,
     *            isNull: is.null,
     *            isArguments: is.arguments,
     *            isInstanceOf: is.instanceOf,
     *            isRegExp: is.regExp
     *        });
     * var myExtender2 = extender.define(is.array, {
     *     pluck: function (arr, m) {
     *         var ret = [];
     *         for (var i = 0, l = arr.length; i < l; i++) {
     *             ret.push(arr[i][m]);
     *         }
     *         return ret;
     *     },
     *
     *     noWrap: {
     *         pluckPlain: function (arr, m) {
     *             var ret = [];
     *             for (var i = 0, l = arr.length; i < l; i++) {
     *                 ret.push(arr[i][m]);
     *             }
     *             return ret;
     *         }
     *     }
     * });
     *
     *
     * ```
     *
     * And you do not want to alter either of them but instead what to create a third that is the union of the two.
     *
     *
     * ```javascript
     * var composed = extender.extend(myExtender).extend(myExtender2);
     * ```
     * So now you can use the new extender with the joined functionality if `myExtender` and `myExtender2`.
     *
     * ```javascript
     * var extended = composed([
     *      {a: "a"},
     *      {a: "b"},
     *      {a: "c"}
     * ]);
     * extended.isArray().value(); //true
     * extended.pluck("a").value(); // ["a", "b", "c"]);
     *
     * ```
     *
     * **Note** `myExtender` and `myExtender2` will **NOT** be altered.
     *
     * **`extender.expose(methods)`**
     *
     * The `expose` method allows you to add methods to your extender that are not wrapped or automatically chained by exposing them on the extender directly.
     *
     * ```
     * var isMethods = {
     *      isFunction: is.function,
     *      isNumber: is.number,
     *      isString: is.string,
     *      isDate: is.date,
     *      isArray: is.array,
     *      isBoolean: is.boolean,
     *      isUndefined: is.undefined,
     *      isDefined: is.defined,
     *      isUndefinedOrNull: is.undefinedOrNull,
     *      isNull: is.null,
     *      isArguments: is.arguments,
     *      isInstanceOf: is.instanceOf,
     *      isRegExp: is.regExp
     * };
     *
     * var myExtender = extender.define(isMethods).expose(isMethods);
     *
     * myExtender.isArray([]); //true
     * myExtender([]).isArray([]).value(); //true
     *
     * ```
     *
     *
     * **Using `instanceof`**
     *
     * When using extenders you can test if a value is an `instanceof` of an extender by using the instanceof operator.
     *
     * ```javascript
     * var str = myExtender("hello");
     *
     * str instanceof myExtender; //true
     * ```
     *
     * ## Examples
     *
     * To see more examples click [here](https://github.com/doug-martin/extender/tree/master/examples)
     */
    function defineExtender(declare) {


        var slice = Array.prototype.slice, undef;

        function indexOf(arr, item) {
            if (arr && arr.length) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    if (arr[i] === item) {
                        return i;
                    }
                }
            }
            return -1;
        }

        function isArray(obj) {
            return Object.prototype.toString.call(obj) === "[object Array]";
        }

        var merge = (function merger() {
            function _merge(target, source, exclude) {
                var name, s;
                for (name in source) {
                    if (source.hasOwnProperty(name) && indexOf(exclude, name) === -1) {
                        s = source[name];
                        if (!(name in target) || (target[name] !== s)) {
                            target[name] = s;
                        }
                    }
                }
                return target;
            }

            return function merge(obj) {
                if (!obj) {
                    obj = {};
                }
                var l = arguments.length;
                var exclude = arguments[arguments.length - 1];
                if (isArray(exclude)) {
                    l--;
                } else {
                    exclude = [];
                }
                for (var i = 1; i < l; i++) {
                    _merge(obj, arguments[i], exclude);
                }
                return obj; // Object
            };
        }());


        function extender(supers) {
            supers = supers || [];
            var Base = declare({
                instance: {
                    constructor: function (value) {
                        this._value = value;
                    },

                    value: function () {
                        return this._value;
                    },

                    eq: function eq(val) {
                        return this["__extender__"](this._value === val);
                    },

                    neq: function neq(other) {
                        return this["__extender__"](this._value !== other);
                    },
                    print: function () {
                        console.log(this._value);
                        return this;
                    }
                }
            }), defined = [];

            function addMethod(proto, name, func) {
                if ("function" !== typeof func) {
                    throw new TypeError("when extending type you must provide a function");
                }
                var extendedMethod;
                if (name === "constructor") {
                    extendedMethod = function () {
                        this._super(arguments);
                        func.apply(this, arguments);
                    };
                } else {
                    extendedMethod = function extendedMethod() {
                        var args = slice.call(arguments);
                        args.unshift(this._value);
                        var ret = func.apply(this, args);
                        return ret !== undef ? this["__extender__"](ret) : this;
                    };
                }
                proto[name] = extendedMethod;
            }

            function addNoWrapMethod(proto, name, func) {
                if ("function" !== typeof func) {
                    throw new TypeError("when extending type you must provide a function");
                }
                var extendedMethod;
                if (name === "constructor") {
                    extendedMethod = function () {
                        this._super(arguments);
                        func.apply(this, arguments);
                    };
                } else {
                    extendedMethod = function extendedMethod() {
                        var args = slice.call(arguments);
                        args.unshift(this._value);
                        return func.apply(this, args);
                    };
                }
                proto[name] = extendedMethod;
            }

            function decorateProto(proto, decoration, nowrap) {
                for (var i in decoration) {
                    if (decoration.hasOwnProperty(i)) {
                        if (i !== "getters" && i !== "setters") {
                            if (i === "noWrap") {
                                decorateProto(proto, decoration[i], true);
                            } else if (nowrap) {
                                addNoWrapMethod(proto, i, decoration[i]);
                            } else {
                                addMethod(proto, i, decoration[i]);
                            }
                        } else {
                            proto[i] = decoration[i];
                        }
                    }
                }
            }

            function _extender(obj) {
                var ret = obj, i, l;
                if (!(obj instanceof Base)) {
                    var OurBase = Base;
                    for (i = 0, l = defined.length; i < l; i++) {
                        var definer = defined[i];
                        if (definer[0](obj)) {
                            OurBase = OurBase.extend({instance: definer[1]});
                        }
                    }
                    ret = new OurBase(obj);
                    ret["__extender__"] = _extender;
                }
                return ret;
            }

            function always() {
                return true;
            }

            function define(tester, decorate) {
                if (arguments.length) {
                    if (typeof tester === "object") {
                        decorate = tester;
                        tester = always;
                    }
                    decorate = decorate || {};
                    var proto = {};
                    decorateProto(proto, decorate);
                    //handle browsers like which skip over the constructor while looping
                    if (!proto.hasOwnProperty("constructor")) {
                        if (decorate.hasOwnProperty("constructor")) {
                            addMethod(proto, "constructor", decorate.constructor);
                        } else {
                            proto.constructor = function () {
                                this._super(arguments);
                            };
                        }
                    }
                    defined.push([tester, proto]);
                }
                return _extender;
            }

            function extend(supr) {
                if (supr && supr.hasOwnProperty("__defined__")) {
                    _extender["__defined__"] = defined = defined.concat(supr["__defined__"]);
                }
                merge(_extender, supr, ["define", "extend", "expose", "__defined__"]);
                return _extender;
            }

            _extender.define = define;
            _extender.extend = extend;
            _extender.expose = function expose() {
                var methods;
                for (var i = 0, l = arguments.length; i < l; i++) {
                    methods = arguments[i];
                    if (typeof methods === "object") {
                        merge(_extender, methods, ["define", "extend", "expose", "__defined__"]);
                    }
                }
                return _extender;
            };
            _extender["__defined__"] = defined;


            return _extender;
        }

        return {
            define: function () {
                return extender().define.apply(extender, arguments);
            },

            extend: function (supr) {
                return extender().define().extend(supr);
            }
        };

    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineExtender(require("declare.js"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["declare"], function (declare) {
            return defineExtender(declare);
        });
    } else {
        this.extender = defineExtender(this.declare);
    }

}).call(this);
},{"declare.js":55}],58:[function(require,module,exports){
module.exports = require("./extender.js");
},{"./extender.js":57}],59:[function(require,module,exports){
(function () {
    "use strict";

    function defineFunction(extended, is, args) {

        var isArray = is.isArray,
            isObject = is.isObject,
            isString = is.isString,
            isFunction = is.isFunction,
            argsToArray = args.argsToArray;

        function spreadArgs(f, args, scope) {
            var ret;
            switch ((args || []).length) {
            case 0:
                ret = f.call(scope);
                break;
            case 1:
                ret = f.call(scope, args[0]);
                break;
            case 2:
                ret = f.call(scope, args[0], args[1]);
                break;
            case 3:
                ret = f.call(scope, args[0], args[1], args[2]);
                break;
            default:
                ret = f.apply(scope, args);
            }
            return ret;
        }

        function hitch(scope, method, args) {
            args = argsToArray(arguments, 2);
            if ((isString(method) && !(method in scope))) {
                throw new Error(method + " property not defined in scope");
            } else if (!isString(method) && !isFunction(method)) {
                throw new Error(method + " is not a function");
            }
            if (isString(method)) {
                return function () {
                    var func = scope[method];
                    if (isFunction(func)) {
                        return spreadArgs(func, args.concat(argsToArray(arguments)), scope);
                    } else {
                        return func;
                    }
                };
            } else {
                if (args.length) {
                    return function () {
                        return spreadArgs(method, args.concat(argsToArray(arguments)), scope);
                    };
                } else {

                    return function () {
                        return spreadArgs(method, arguments, scope);
                    };
                }
            }
        }


        function applyFirst(method, args) {
            args = argsToArray(arguments, 1);
            if (!isString(method) && !isFunction(method)) {
                throw new Error(method + " must be the name of a property or function to execute");
            }
            if (isString(method)) {
                return function () {
                    var scopeArgs = argsToArray(arguments), scope = scopeArgs.shift();
                    var func = scope[method];
                    if (isFunction(func)) {
                        scopeArgs = args.concat(scopeArgs);
                        return spreadArgs(func, scopeArgs, scope);
                    } else {
                        return func;
                    }
                };
            } else {
                return function () {
                    var scopeArgs = argsToArray(arguments), scope = scopeArgs.shift();
                    scopeArgs = args.concat(scopeArgs);
                    return spreadArgs(method, scopeArgs, scope);
                };
            }
        }


        function hitchIgnore(scope, method, args) {
            args = argsToArray(arguments, 2);
            if ((isString(method) && !(method in scope))) {
                throw new Error(method + " property not defined in scope");
            } else if (!isString(method) && !isFunction(method)) {
                throw new Error(method + " is not a function");
            }
            if (isString(method)) {
                return function () {
                    var func = scope[method];
                    if (isFunction(func)) {
                        return spreadArgs(func, args, scope);
                    } else {
                        return func;
                    }
                };
            } else {
                return function () {
                    return spreadArgs(method, args, scope);
                };
            }
        }


        function hitchAll(scope) {
            var funcs = argsToArray(arguments, 1);
            if (!isObject(scope) && !isFunction(scope)) {
                throw new TypeError("scope must be an object");
            }
            if (funcs.length === 1 && isArray(funcs[0])) {
                funcs = funcs[0];
            }
            if (!funcs.length) {
                funcs = [];
                for (var k in scope) {
                    if (scope.hasOwnProperty(k) && isFunction(scope[k])) {
                        funcs.push(k);
                    }
                }
            }
            for (var i = 0, l = funcs.length; i < l; i++) {
                scope[funcs[i]] = hitch(scope, scope[funcs[i]]);
            }
            return scope;
        }


        function partial(method, args) {
            args = argsToArray(arguments, 1);
            if (!isString(method) && !isFunction(method)) {
                throw new Error(method + " must be the name of a property or function to execute");
            }
            if (isString(method)) {
                return function () {
                    var func = this[method];
                    if (isFunction(func)) {
                        var scopeArgs = args.concat(argsToArray(arguments));
                        return spreadArgs(func, scopeArgs, this);
                    } else {
                        return func;
                    }
                };
            } else {
                return function () {
                    var scopeArgs = args.concat(argsToArray(arguments));
                    return spreadArgs(method, scopeArgs, this);
                };
            }
        }

        function curryFunc(f, execute) {
            return function () {
                var args = argsToArray(arguments);
                return execute ? spreadArgs(f, arguments, this) : function () {
                    return spreadArgs(f, args.concat(argsToArray(arguments)), this);
                };
            };
        }


        function curry(depth, cb, scope) {
            var f;
            if (scope) {
                f = hitch(scope, cb);
            } else {
                f = cb;
            }
            if (depth) {
                var len = depth - 1;
                for (var i = len; i >= 0; i--) {
                    f = curryFunc(f, i === len);
                }
            }
            return f;
        }

        return extended
            .define(isObject, {
                bind: hitch,
                bindAll: hitchAll,
                bindIgnore: hitchIgnore,
                curry: function (scope, depth, fn) {
                    return curry(depth, fn, scope);
                }
            })
            .define(isFunction, {
                bind: function (fn, obj) {
                    return spreadArgs(hitch, [obj, fn].concat(argsToArray(arguments, 2)), this);
                },
                bindIgnore: function (fn, obj) {
                    return spreadArgs(hitchIgnore, [obj, fn].concat(argsToArray(arguments, 2)), this);
                },
                partial: partial,
                applyFirst: applyFirst,
                curry: function (fn, num, scope) {
                    return curry(num, fn, scope);
                },
                noWrap: {
                    f: function () {
                        return this.value();
                    }
                }
            })
            .define(isString, {
                bind: function (str, scope) {
                    return hitch(scope, str);
                },
                bindIgnore: function (str, scope) {
                    return hitchIgnore(scope, str);
                },
                partial: partial,
                applyFirst: applyFirst,
                curry: function (fn, depth, scope) {
                    return curry(depth, fn, scope);
                }
            })
            .expose({
                bind: hitch,
                bindAll: hitchAll,
                bindIgnore: hitchIgnore,
                partial: partial,
                applyFirst: applyFirst,
                curry: curry
            });

    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineFunction(require("extended"), require("is-extended"), require("arguments-extended"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended", "is-extended", "arguments-extended"], function (extended, is, args) {
            return defineFunction(extended, is, args);
        });
    } else {
        this.functionExtended = defineFunction(this.extended, this.isExtended, this.argumentsExtended);
    }

}).call(this);







},{"arguments-extended":51,"extended":56,"is-extended":66}],60:[function(require,module,exports){
var process=require("__browserify_process");if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (typeof emitter._events[type] === 'function')
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

},{"__browserify_process":64}],61:[function(require,module,exports){
// nothing to see here... no file methods for the browser

},{}],62:[function(require,module,exports){
var process=require("__browserify_process");function filter (xs, fn) {
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (fn(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length; i >= 0; i--) {
    var last = parts[i];
    if (last == '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Regex to split a filename into [*, dir, basename, ext]
// posix version
var splitPathRe = /^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
var resolvedPath = '',
    resolvedAbsolute = false;

for (var i = arguments.length; i >= -1 && !resolvedAbsolute; i--) {
  var path = (i >= 0)
      ? arguments[i]
      : process.cwd();

  // Skip empty and invalid entries
  if (typeof path !== 'string' || !path) {
    continue;
  }

  resolvedPath = path + '/' + resolvedPath;
  resolvedAbsolute = path.charAt(0) === '/';
}

// At this point the path should be resolved to a full absolute path, but
// handle relative paths to be safe (might happen when process.cwd() fails)

// Normalize the path
resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
var isAbsolute = path.charAt(0) === '/',
    trailingSlash = path.slice(-1) === '/';

// Normalize the path
path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }
  
  return (isAbsolute ? '/' : '') + path;
};


// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    return p && typeof p === 'string';
  }).join('/'));
};


exports.dirname = function(path) {
  var dir = splitPathRe.exec(path)[1] || '';
  var isWindows = false;
  if (!dir) {
    // No dirname
    return '.';
  } else if (dir.length === 1 ||
      (isWindows && dir.length <= 3 && dir.charAt(1) === ':')) {
    // It is just a slash or a drive letter with a slash
    return dir;
  } else {
    // It is a full dirname, strip trailing slash
    return dir.substring(0, dir.length - 1);
  }
};


exports.basename = function(path, ext) {
  var f = splitPathRe.exec(path)[2] || '';
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPathRe.exec(path)[3] || '';
};

exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';

},{"__browserify_process":64}],63:[function(require,module,exports){
require=(function(e,t,n,r){function i(r){if(!n[r]){if(!t[r]){if(e)return e(r);throw new Error("Cannot find module '"+r+"'")}var s=n[r]={exports:{}};t[r][0](function(e){var n=t[r][1][e];return i(n?n:e)},s,s.exports)}return n[r].exports}for(var s=0;s<r.length;s++)i(r[s]);return i})(typeof require!=="undefined"&&require,{1:[function(require,module,exports){
// UTILITY
var util = require('util');
var Buffer = require("buffer").Buffer;
var pSlice = Array.prototype.slice;

function objectKeys(object) {
  if (Object.keys) return Object.keys(object);
  var result = [];
  for (var name in object) {
    if (Object.prototype.hasOwnProperty.call(object, name)) {
      result.push(name);
    }
  }
  return result;
}

// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.message = options.message;
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  var stackStartFunction = options.stackStartFunction || fail;

  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  }
};
util.inherits(assert.AssertionError, Error);

function replacer(key, value) {
  if (value === undefined) {
    return '' + value;
  }
  if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) {
    return value.toString();
  }
  if (typeof value === 'function' || value instanceof RegExp) {
    return value.toString();
  }
  return value;
}

function truncate(s, n) {
  if (typeof s == 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}

assert.AssertionError.prototype.toString = function() {
  if (this.message) {
    return [this.name + ':', this.message].join(' ');
  } else {
    return [
      this.name + ':',
      truncate(JSON.stringify(this.actual, replacer), 128),
      this.operator,
      truncate(JSON.stringify(this.expected, replacer), 128)
    ].join(' ');
  }
};

// assert.AssertionError instanceof Error

assert.AssertionError.__proto__ = Error.prototype;

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!!!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

function _deepEqual(actual, expected) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;

  } else if (Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
    if (actual.length != expected.length) return false;

    for (var i = 0; i < actual.length; i++) {
      if (actual[i] !== expected[i]) return false;
    }

    return true;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

  // 7.3. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if (typeof actual != 'object' && typeof expected != 'object') {
    return actual == expected;

  // 7.4. For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected);
  }
}

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b) {
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
    return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b);
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b),
        key, i;
  } catch (e) {//happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key])) return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (expected instanceof RegExp) {
    return expected.test(actual);
  } else if (actual instanceof expected) {
    return true;
  } else if (expected.call({}, actual) === true) {
    return true;
  }

  return false;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  try {
    block();
  } catch (e) {
    actual = e;
  }

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail('Missing expected exception' + message);
  }

  if (!shouldThrow && expectedException(actual, expected)) {
    fail('Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [true].concat(pSlice.call(arguments)));
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws.apply(this, [false].concat(pSlice.call(arguments)));
};

assert.ifError = function(err) { if (err) {throw err;}};

},{"util":2,"buffer":3}],2:[function(require,module,exports){
var events = require('events');

exports.isArray = isArray;
exports.isDate = function(obj){return Object.prototype.toString.call(obj) === '[object Date]'};
exports.isRegExp = function(obj){return Object.prototype.toString.call(obj) === '[object RegExp]'};


exports.print = function () {};
exports.puts = function () {};
exports.debug = function() {};

exports.inspect = function(obj, showHidden, depth, colors) {
  var seen = [];

  var stylize = function(str, styleType) {
    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    var styles =
        { 'bold' : [1, 22],
          'italic' : [3, 23],
          'underline' : [4, 24],
          'inverse' : [7, 27],
          'white' : [37, 39],
          'grey' : [90, 39],
          'black' : [30, 39],
          'blue' : [34, 39],
          'cyan' : [36, 39],
          'green' : [32, 39],
          'magenta' : [35, 39],
          'red' : [31, 39],
          'yellow' : [33, 39] };

    var style =
        { 'special': 'cyan',
          'number': 'blue',
          'boolean': 'yellow',
          'undefined': 'grey',
          'null': 'bold',
          'string': 'green',
          'date': 'magenta',
          // "name": intentionally not styling
          'regexp': 'red' }[styleType];

    if (style) {
      return '\033[' + styles[style][0] + 'm' + str +
             '\033[' + styles[style][1] + 'm';
    } else {
      return str;
    }
  };
  if (! colors) {
    stylize = function(str, styleType) { return str; };
  }

  function format(value, recurseTimes) {
    // Provide a hook for user-specified inspect functions.
    // Check that value is an object with an inspect function on it
    if (value && typeof value.inspect === 'function' &&
        // Filter out the util module, it's inspect function is special
        value !== exports &&
        // Also filter out any prototype objects using the circular check.
        !(value.constructor && value.constructor.prototype === value)) {
      return value.inspect(recurseTimes);
    }

    // Primitive types cannot have properties
    switch (typeof value) {
      case 'undefined':
        return stylize('undefined', 'undefined');

      case 'string':
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return stylize(simple, 'string');

      case 'number':
        return stylize('' + value, 'number');

      case 'boolean':
        return stylize('' + value, 'boolean');
    }
    // For some reason typeof null is "object", so special case here.
    if (value === null) {
      return stylize('null', 'null');
    }

    // Look up the keys of the object.
    var visible_keys = Object_keys(value);
    var keys = showHidden ? Object_getOwnPropertyNames(value) : visible_keys;

    // Functions without properties can be shortcutted.
    if (typeof value === 'function' && keys.length === 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        var name = value.name ? ': ' + value.name : '';
        return stylize('[Function' + name + ']', 'special');
      }
    }

    // Dates without properties can be shortcutted
    if (isDate(value) && keys.length === 0) {
      return stylize(value.toUTCString(), 'date');
    }

    var base, type, braces;
    // Determine the object type
    if (isArray(value)) {
      type = 'Array';
      braces = ['[', ']'];
    } else {
      type = 'Object';
      braces = ['{', '}'];
    }

    // Make functions say that they are functions
    if (typeof value === 'function') {
      var n = value.name ? ': ' + value.name : '';
      base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
    } else {
      base = '';
    }

    // Make dates with properties first say the date
    if (isDate(value)) {
      base = ' ' + value.toUTCString();
    }

    if (keys.length === 0) {
      return braces[0] + base + braces[1];
    }

    if (recurseTimes < 0) {
      if (isRegExp(value)) {
        return stylize('' + value, 'regexp');
      } else {
        return stylize('[Object]', 'special');
      }
    }

    seen.push(value);

    var output = keys.map(function(key) {
      var name, str;
      if (value.__lookupGetter__) {
        if (value.__lookupGetter__(key)) {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Getter/Setter]', 'special');
          } else {
            str = stylize('[Getter]', 'special');
          }
        } else {
          if (value.__lookupSetter__(key)) {
            str = stylize('[Setter]', 'special');
          }
        }
      }
      if (visible_keys.indexOf(key) < 0) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (seen.indexOf(value[key]) < 0) {
          if (recurseTimes === null) {
            str = format(value[key]);
          } else {
            str = format(value[key], recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (isArray(value)) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = stylize('[Circular]', 'special');
        }
      }
      if (typeof name === 'undefined') {
        if (type === 'Array' && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    });

    seen.pop();

    var numLinesEst = 0;
    var length = output.reduce(function(prev, cur) {
      numLinesEst++;
      if (cur.indexOf('\n') >= 0) numLinesEst++;
      return prev + cur.length + 1;
    }, 0);

    if (length > 50) {
      output = braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];

    } else {
      output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }

    return output;
  }
  return format(obj, (typeof depth === 'undefined' ? 2 : depth));
};


function isArray(ar) {
  return ar instanceof Array ||
         Array.isArray(ar) ||
         (ar && ar !== Object.prototype && isArray(ar.__proto__));
}


function isRegExp(re) {
  return re instanceof RegExp ||
    (typeof re === 'object' && Object.prototype.toString.call(re) === '[object RegExp]');
}


function isDate(d) {
  if (d instanceof Date) return true;
  if (typeof d !== 'object') return false;
  var properties = Date.prototype && Object_getOwnPropertyNames(Date.prototype);
  var proto = d.__proto__ && Object_getOwnPropertyNames(d.__proto__);
  return JSON.stringify(proto) === JSON.stringify(properties);
}

function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}

exports.log = function (msg) {};

exports.pump = null;

var Object_keys = Object.keys || function (obj) {
    var res = [];
    for (var key in obj) res.push(key);
    return res;
};

var Object_getOwnPropertyNames = Object.getOwnPropertyNames || function (obj) {
    var res = [];
    for (var key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) res.push(key);
    }
    return res;
};

var Object_create = Object.create || function (prototype, properties) {
    // from es5-shim
    var object;
    if (prototype === null) {
        object = { '__proto__' : null };
    }
    else {
        if (typeof prototype !== 'object') {
            throw new TypeError(
                'typeof prototype[' + (typeof prototype) + '] != \'object\''
            );
        }
        var Type = function () {};
        Type.prototype = prototype;
        object = new Type();
        object.__proto__ = prototype;
    }
    if (typeof properties !== 'undefined' && Object.defineProperties) {
        Object.defineProperties(object, properties);
    }
    return object;
};

exports.inherits = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object_create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
};

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (typeof f !== 'string') {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(exports.inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j': return JSON.stringify(args[i++]);
      default:
        return x;
    }
  });
  for(var x = args[i]; i < len; x = args[++i]){
    if (x === null || typeof x !== 'object') {
      str += ' ' + x;
    } else {
      str += ' ' + exports.inspect(x);
    }
  }
  return str;
};

},{"events":4}],5:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],6:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            if (ev.source === window && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],4:[function(require,module,exports){
(function(process){if (!process.EventEmitter) process.EventEmitter = function () {};

var EventEmitter = exports.EventEmitter = process.EventEmitter;
var isArray = typeof Array.isArray === 'function'
    ? Array.isArray
    : function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]'
    }
;
function indexOf (xs, x) {
    if (xs.indexOf) return xs.indexOf(x);
    for (var i = 0; i < xs.length; i++) {
        if (x === xs[i]) return i;
    }
    return -1;
}

// By default EventEmitters will print a warning if more than
// 10 listeners are added to it. This is a useful default which
// helps finding memory leaks.
//
// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
var defaultMaxListeners = 10;
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!this._events) this._events = {};
  this._events.maxListeners = n;
};


EventEmitter.prototype.emit = function(type) {
  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events || !this._events.error ||
        (isArray(this._events.error) && !this._events.error.length))
    {
      if (arguments[1] instanceof Error) {
        throw arguments[1]; // Unhandled 'error' event
      } else {
        throw new Error("Uncaught, unspecified 'error' event.");
      }
      return false;
    }
  }

  if (!this._events) return false;
  var handler = this._events[type];
  if (!handler) return false;

  if (typeof handler == 'function') {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        var args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
    return true;

  } else if (isArray(handler)) {
    var args = Array.prototype.slice.call(arguments, 1);

    var listeners = handler.slice();
    for (var i = 0, l = listeners.length; i < l; i++) {
      listeners[i].apply(this, args);
    }
    return true;

  } else {
    return false;
  }
};

// EventEmitter is defined in src/node_events.cc
// EventEmitter.prototype.emit() is also defined there.
EventEmitter.prototype.addListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('addListener only takes instances of Function');
  }

  if (!this._events) this._events = {};

  // To avoid recursion in the case that type == "newListeners"! Before
  // adding it to the listeners, first emit "newListeners".
  this.emit('newListener', type, listener);

  if (!this._events[type]) {
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  } else if (isArray(this._events[type])) {

    // Check for listener leak
    if (!this._events[type].warned) {
      var m;
      if (this._events.maxListeners !== undefined) {
        m = this._events.maxListeners;
      } else {
        m = defaultMaxListeners;
      }

      if (m && m > 0 && this._events[type].length > m) {
        this._events[type].warned = true;
        console.error('(node) warning: possible EventEmitter memory ' +
                      'leak detected. %d listeners added. ' +
                      'Use emitter.setMaxListeners() to increase limit.',
                      this._events[type].length);
        console.trace();
      }
    }

    // If we've already got an array, just append.
    this._events[type].push(listener);
  } else {
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  var self = this;
  self.on(type, function g() {
    self.removeListener(type, g);
    listener.apply(this, arguments);
  });

  return this;
};

EventEmitter.prototype.removeListener = function(type, listener) {
  if ('function' !== typeof listener) {
    throw new Error('removeListener only takes instances of Function');
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (!this._events || !this._events[type]) return this;

  var list = this._events[type];

  if (isArray(list)) {
    var i = indexOf(list, listener);
    if (i < 0) return this;
    list.splice(i, 1);
    if (list.length == 0)
      delete this._events[type];
  } else if (this._events[type] === listener) {
    delete this._events[type];
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  if (arguments.length === 0) {
    this._events = {};
    return this;
  }

  // does not use listeners(), so no side effect of creating _events[type]
  if (type && this._events && this._events[type]) this._events[type] = null;
  return this;
};

EventEmitter.prototype.listeners = function(type) {
  if (!this._events) this._events = {};
  if (!this._events[type]) this._events[type] = [];
  if (!isArray(this._events[type])) {
    this._events[type] = [this._events[type]];
  }
  return this._events[type];
};

})(require("__browserify_process"))
},{"__browserify_process":6}],"buffer-browserify":[function(require,module,exports){
module.exports=require('q9TxCC');
},{}],"q9TxCC":[function(require,module,exports){
function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
    case 'binary':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.binaryWrite = SlowBuffer.prototype.asciiWrite;

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.binarySlice = SlowBuffer.prototype.asciiSlice;

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

SlowBuffer.prototype.fill = function(value, start, end) {
  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  for (var i = start; i < end; i++) {
    this[i] = value;
  }
}

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        if (subject instanceof Buffer) {
          this.parent[i + this.offset] = subject.readUInt8(i);
        }
        else {
          this.parent[i + this.offset] = subject[i];
        }
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1];
    }
  } else {
    val = buffer.parent[buffer.offset + offset];
    if (offset + 1 < buffer.length) {
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    }
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return 0;

  if (isBigEndian) {
    if (offset + 1 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 1] << 16;
    if (offset + 2 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 2] << 8;
    if (offset + 3 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    if (offset + 2 < buffer.length)
      val = buffer.parent[buffer.offset + offset + 2] << 16;
    if (offset + 1 < buffer.length)
      val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    if (offset + 3 < buffer.length)
      val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (offset >= buffer.length) return;

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  if (offset < buffer.length) {
    buffer.parent[buffer.offset + offset] = value;
  }
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 2); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value & (0xff << (8 * (isBigEndian ? 1 - i : i)))) >>>
            (isBigEndian ? 1 - i : i) * 8;
  }

}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  for (var i = 0; i < Math.min(buffer.length - offset, 4); i++) {
    buffer.parent[buffer.offset + offset + i] =
        (value >>> (isBigEndian ? 3 - i : i) * 8) & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

},{"assert":1,"./buffer_ieee754":5,"base64-js":7}],7:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}],8:[function(require,module,exports){
exports.readIEEE754 = function(buffer, offset, isBE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isBE ? 0 : (nBytes - 1),
      d = isBE ? 1 : -1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.writeIEEE754 = function(buffer, value, offset, isBE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isBE ? (nBytes - 1) : 0,
      d = isBE ? -1 : 1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

},{}],3:[function(require,module,exports){
function SlowBuffer (size) {
    this.length = size;
};

var assert = require('assert');

exports.INSPECT_MAX_BYTES = 50;


function toHex(n) {
  if (n < 16) return '0' + n.toString(16);
  return n.toString(16);
}

function utf8ToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; i++)
    if (str.charCodeAt(i) <= 0x7F)
      byteArray.push(str.charCodeAt(i));
    else {
      var h = encodeURIComponent(str.charAt(i)).substr(1).split('%');
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16));
    }

  return byteArray;
}

function asciiToBytes(str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++ )
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push( str.charCodeAt(i) & 0xFF );

  return byteArray;
}

function base64ToBytes(str) {
  return require("base64-js").toByteArray(str);
}

SlowBuffer.byteLength = function (str, encoding) {
  switch (encoding || "utf8") {
    case 'hex':
      return str.length / 2;

    case 'utf8':
    case 'utf-8':
      return utf8ToBytes(str).length;

    case 'ascii':
      return str.length;

    case 'base64':
      return base64ToBytes(str).length;

    default:
      throw new Error('Unknown encoding');
  }
};

function blitBuffer(src, dst, offset, length) {
  var pos, i = 0;
  while (i < length) {
    if ((i+offset >= dst.length) || (i >= src.length))
      break;

    dst[i + offset] = src[i];
    i++;
  }
  return i;
}

SlowBuffer.prototype.utf8Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(utf8ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.asciiWrite = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten =  blitBuffer(asciiToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Write = function (string, offset, length) {
  var bytes, pos;
  return SlowBuffer._charsWritten = blitBuffer(base64ToBytes(string), this, offset, length);
};

SlowBuffer.prototype.base64Slice = function (start, end) {
  var bytes = Array.prototype.slice.apply(this, arguments)
  return require("base64-js").fromByteArray(bytes);
}

function decodeUtf8Char(str) {
  try {
    return decodeURIComponent(str);
  } catch (err) {
    return String.fromCharCode(0xFFFD); // UTF 8 invalid char
  }
}

SlowBuffer.prototype.utf8Slice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var res = "";
  var tmp = "";
  var i = 0;
  while (i < bytes.length) {
    if (bytes[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(bytes[i]);
      tmp = "";
    } else
      tmp += "%" + bytes[i].toString(16);

    i++;
  }

  return res + decodeUtf8Char(tmp);
}

SlowBuffer.prototype.asciiSlice = function () {
  var bytes = Array.prototype.slice.apply(this, arguments);
  var ret = "";
  for (var i = 0; i < bytes.length; i++)
    ret += String.fromCharCode(bytes[i]);
  return ret;
}

SlowBuffer.prototype.inspect = function() {
  var out = [],
      len = this.length;
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }
  return '<SlowBuffer ' + out.join(' ') + '>';
};


SlowBuffer.prototype.hexSlice = function(start, end) {
  var len = this.length;

  if (!start || start < 0) start = 0;
  if (!end || end < 0 || end > len) end = len;

  var out = '';
  for (var i = start; i < end; i++) {
    out += toHex(this[i]);
  }
  return out;
};


SlowBuffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();
  start = +start || 0;
  if (typeof end == 'undefined') end = this.length;

  // Fastpath empty strings
  if (+end == start) {
    return '';
  }

  switch (encoding) {
    case 'hex':
      return this.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.utf8Slice(start, end);

    case 'ascii':
      return this.asciiSlice(start, end);

    case 'binary':
      return this.binarySlice(start, end);

    case 'base64':
      return this.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


SlowBuffer.prototype.hexWrite = function(string, offset, length) {
  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }

  // must be an even number of digits
  var strLen = string.length;
  if (strLen % 2) {
    throw new Error('Invalid hex string');
  }
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(byte)) throw new Error('Invalid hex string');
    this[offset + i] = byte;
  }
  SlowBuffer._charsWritten = i * 2;
  return i;
};


SlowBuffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  switch (encoding) {
    case 'hex':
      return this.hexWrite(string, offset, length);

    case 'utf8':
    case 'utf-8':
      return this.utf8Write(string, offset, length);

    case 'ascii':
      return this.asciiWrite(string, offset, length);

    case 'binary':
      return this.binaryWrite(string, offset, length);

    case 'base64':
      return this.base64Write(string, offset, length);

    case 'ucs2':
    case 'ucs-2':
      return this.ucs2Write(string, offset, length);

    default:
      throw new Error('Unknown encoding');
  }
};


// slice(start, end)
SlowBuffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;

  if (end > this.length) {
    throw new Error('oob');
  }
  if (start > end) {
    throw new Error('oob');
  }

  return new Buffer(this, end - start, +start);
};

SlowBuffer.prototype.copy = function(target, targetstart, sourcestart, sourceend) {
  var temp = [];
  for (var i=sourcestart; i<sourceend; i++) {
    assert.ok(typeof this[i] !== 'undefined', "copying undefined buffer bytes!");
    temp.push(this[i]);
  }

  for (var i=targetstart; i<targetstart+temp.length; i++) {
    target[i] = temp[i-targetstart];
  }
};

function coerce(length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length);
  return length < 0 ? 0 : length;
}


// Buffer

function Buffer(subject, encoding, offset) {
  if (!(this instanceof Buffer)) {
    return new Buffer(subject, encoding, offset);
  }

  var type;

  // Are we slicing?
  if (typeof offset === 'number') {
    this.length = coerce(encoding);
    this.parent = subject;
    this.offset = offset;
  } else {
    // Find the length
    switch (type = typeof subject) {
      case 'number':
        this.length = coerce(subject);
        break;

      case 'string':
        this.length = Buffer.byteLength(subject, encoding);
        break;

      case 'object': // Assume object is an array
        this.length = coerce(subject.length);
        break;

      default:
        throw new Error('First argument needs to be a number, ' +
                        'array or string.');
    }

    if (this.length > Buffer.poolSize) {
      // Big buffer, just alloc one.
      this.parent = new SlowBuffer(this.length);
      this.offset = 0;

    } else {
      // Small buffer.
      if (!pool || pool.length - pool.used < this.length) allocPool();
      this.parent = pool;
      this.offset = pool.used;
      pool.used += this.length;
    }

    // Treat array-ish objects as a byte array.
    if (isArrayIsh(subject)) {
      for (var i = 0; i < this.length; i++) {
        this.parent[i + this.offset] = subject[i];
      }
    } else if (type == 'string') {
      // We are a string
      this.length = this.write(subject, 0, encoding);
    }
  }

}

function isArrayIsh(subject) {
  return Array.isArray(subject) || Buffer.isBuffer(subject) ||
         subject && typeof subject === 'object' &&
         typeof subject.length === 'number';
}

exports.SlowBuffer = SlowBuffer;
exports.Buffer = Buffer;

Buffer.poolSize = 8 * 1024;
var pool;

function allocPool() {
  pool = new SlowBuffer(Buffer.poolSize);
  pool.used = 0;
}


// Static methods
Buffer.isBuffer = function isBuffer(b) {
  return b instanceof Buffer || b instanceof SlowBuffer;
};

Buffer.concat = function (list, totalLength) {
  if (!Array.isArray(list)) {
    throw new Error("Usage: Buffer.concat(list, [totalLength])\n \
      list should be an Array.");
  }

  if (list.length === 0) {
    return new Buffer(0);
  } else if (list.length === 1) {
    return list[0];
  }

  if (typeof totalLength !== 'number') {
    totalLength = 0;
    for (var i = 0; i < list.length; i++) {
      var buf = list[i];
      totalLength += buf.length;
    }
  }

  var buffer = new Buffer(totalLength);
  var pos = 0;
  for (var i = 0; i < list.length; i++) {
    var buf = list[i];
    buf.copy(buffer, pos);
    pos += buf.length;
  }
  return buffer;
};

// Inspect
Buffer.prototype.inspect = function inspect() {
  var out = [],
      len = this.length;

  for (var i = 0; i < len; i++) {
    out[i] = toHex(this.parent[i + this.offset]);
    if (i == exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...';
      break;
    }
  }

  return '<Buffer ' + out.join(' ') + '>';
};


Buffer.prototype.get = function get(i) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i];
};


Buffer.prototype.set = function set(i, v) {
  if (i < 0 || i >= this.length) throw new Error('oob');
  return this.parent[this.offset + i] = v;
};


// write(string, offset = 0, length = buffer.length-offset, encoding = 'utf8')
Buffer.prototype.write = function(string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length;
      length = undefined;
    }
  } else {  // legacy
    var swap = encoding;
    encoding = offset;
    offset = length;
    length = swap;
  }

  offset = +offset || 0;
  var remaining = this.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = +length;
    if (length > remaining) {
      length = remaining;
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase();

  var ret;
  switch (encoding) {
    case 'hex':
      ret = this.parent.hexWrite(string, this.offset + offset, length);
      break;

    case 'utf8':
    case 'utf-8':
      ret = this.parent.utf8Write(string, this.offset + offset, length);
      break;

    case 'ascii':
      ret = this.parent.asciiWrite(string, this.offset + offset, length);
      break;

    case 'binary':
      ret = this.parent.binaryWrite(string, this.offset + offset, length);
      break;

    case 'base64':
      // Warning: maxLength not taken into account in base64Write
      ret = this.parent.base64Write(string, this.offset + offset, length);
      break;

    case 'ucs2':
    case 'ucs-2':
      ret = this.parent.ucs2Write(string, this.offset + offset, length);
      break;

    default:
      throw new Error('Unknown encoding');
  }

  Buffer._charsWritten = SlowBuffer._charsWritten;

  return ret;
};


// toString(encoding, start=0, end=buffer.length)
Buffer.prototype.toString = function(encoding, start, end) {
  encoding = String(encoding || 'utf8').toLowerCase();

  if (typeof start == 'undefined' || start < 0) {
    start = 0;
  } else if (start > this.length) {
    start = this.length;
  }

  if (typeof end == 'undefined' || end > this.length) {
    end = this.length;
  } else if (end < 0) {
    end = 0;
  }

  start = start + this.offset;
  end = end + this.offset;

  switch (encoding) {
    case 'hex':
      return this.parent.hexSlice(start, end);

    case 'utf8':
    case 'utf-8':
      return this.parent.utf8Slice(start, end);

    case 'ascii':
      return this.parent.asciiSlice(start, end);

    case 'binary':
      return this.parent.binarySlice(start, end);

    case 'base64':
      return this.parent.base64Slice(start, end);

    case 'ucs2':
    case 'ucs-2':
      return this.parent.ucs2Slice(start, end);

    default:
      throw new Error('Unknown encoding');
  }
};


// byteLength
Buffer.byteLength = SlowBuffer.byteLength;


// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill(value, start, end) {
  value || (value = 0);
  start || (start = 0);
  end || (end = this.length);

  if (typeof value === 'string') {
    value = value.charCodeAt(0);
  }
  if (!(typeof value === 'number') || isNaN(value)) {
    throw new Error('value is not a number');
  }

  if (end < start) throw new Error('end < start');

  // Fill 0 bytes; we're done
  if (end === start) return 0;
  if (this.length == 0) return 0;

  if (start < 0 || start >= this.length) {
    throw new Error('start out of bounds');
  }

  if (end < 0 || end > this.length) {
    throw new Error('end out of bounds');
  }

  return this.parent.fill(value,
                          start + this.offset,
                          end + this.offset);
};


// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function(target, target_start, start, end) {
  var source = this;
  start || (start = 0);
  end || (end = this.length);
  target_start || (target_start = 0);

  if (end < start) throw new Error('sourceEnd < sourceStart');

  // Copy 0 bytes; we're done
  if (end === start) return 0;
  if (target.length == 0 || source.length == 0) return 0;

  if (target_start < 0 || target_start >= target.length) {
    throw new Error('targetStart out of bounds');
  }

  if (start < 0 || start >= source.length) {
    throw new Error('sourceStart out of bounds');
  }

  if (end < 0 || end > source.length) {
    throw new Error('sourceEnd out of bounds');
  }

  // Are we oob?
  if (end > this.length) {
    end = this.length;
  }

  if (target.length - target_start < end - start) {
    end = target.length - target_start + start;
  }

  return this.parent.copy(target.parent,
                          target_start + target.offset,
                          start + this.offset,
                          end + this.offset);
};


// slice(start, end)
Buffer.prototype.slice = function(start, end) {
  if (end === undefined) end = this.length;
  if (end > this.length) throw new Error('oob');
  if (start > end) throw new Error('oob');

  return new Buffer(this.parent, end - start, +start + this.offset);
};


// Legacy methods for backwards compatibility.

Buffer.prototype.utf8Slice = function(start, end) {
  return this.toString('utf8', start, end);
};

Buffer.prototype.binarySlice = function(start, end) {
  return this.toString('binary', start, end);
};

Buffer.prototype.asciiSlice = function(start, end) {
  return this.toString('ascii', start, end);
};

Buffer.prototype.utf8Write = function(string, offset) {
  return this.write(string, offset, 'utf8');
};

Buffer.prototype.binaryWrite = function(string, offset) {
  return this.write(string, offset, 'binary');
};

Buffer.prototype.asciiWrite = function(string, offset) {
  return this.write(string, offset, 'ascii');
};

Buffer.prototype.readUInt8 = function(offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  return buffer.parent[buffer.offset + offset];
};

function readUInt16(buffer, offset, isBigEndian, noAssert) {
  var val = 0;


  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset] << 8;
    val |= buffer.parent[buffer.offset + offset + 1];
  } else {
    val = buffer.parent[buffer.offset + offset];
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
  }

  return val;
}

Buffer.prototype.readUInt16LE = function(offset, noAssert) {
  return readUInt16(this, offset, false, noAssert);
};

Buffer.prototype.readUInt16BE = function(offset, noAssert) {
  return readUInt16(this, offset, true, noAssert);
};

function readUInt32(buffer, offset, isBigEndian, noAssert) {
  var val = 0;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  if (isBigEndian) {
    val = buffer.parent[buffer.offset + offset + 1] << 16;
    val |= buffer.parent[buffer.offset + offset + 2] << 8;
    val |= buffer.parent[buffer.offset + offset + 3];
    val = val + (buffer.parent[buffer.offset + offset] << 24 >>> 0);
  } else {
    val = buffer.parent[buffer.offset + offset + 2] << 16;
    val |= buffer.parent[buffer.offset + offset + 1] << 8;
    val |= buffer.parent[buffer.offset + offset];
    val = val + (buffer.parent[buffer.offset + offset + 3] << 24 >>> 0);
  }

  return val;
}

Buffer.prototype.readUInt32LE = function(offset, noAssert) {
  return readUInt32(this, offset, false, noAssert);
};

Buffer.prototype.readUInt32BE = function(offset, noAssert) {
  return readUInt32(this, offset, true, noAssert);
};


/*
 * Signed integer types, yay team! A reminder on how two's complement actually
 * works. The first bit is the signed bit, i.e. tells us whether or not the
 * number should be positive or negative. If the two's complement value is
 * positive, then we're done, as it's equivalent to the unsigned representation.
 *
 * Now if the number is positive, you're pretty much done, you can just leverage
 * the unsigned translations and return those. Unfortunately, negative numbers
 * aren't quite that straightforward.
 *
 * At first glance, one might be inclined to use the traditional formula to
 * translate binary numbers between the positive and negative values in two's
 * complement. (Though it doesn't quite work for the most negative value)
 * Mainly:
 *  - invert all the bits
 *  - add one to the result
 *
 * Of course, this doesn't quite work in Javascript. Take for example the value
 * of -128. This could be represented in 16 bits (big-endian) as 0xff80. But of
 * course, Javascript will do the following:
 *
 * > ~0xff80
 * -65409
 *
 * Whoh there, Javascript, that's not quite right. But wait, according to
 * Javascript that's perfectly correct. When Javascript ends up seeing the
 * constant 0xff80, it has no notion that it is actually a signed number. It
 * assumes that we've input the unsigned value 0xff80. Thus, when it does the
 * binary negation, it casts it into a signed value, (positive 0xff80). Then
 * when you perform binary negation on that, it turns it into a negative number.
 *
 * Instead, we're going to have to use the following general formula, that works
 * in a rather Javascript friendly way. I'm glad we don't support this kind of
 * weird numbering scheme in the kernel.
 *
 * (BIT-MAX - (unsigned)val + 1) * -1
 *
 * The astute observer, may think that this doesn't make sense for 8-bit numbers
 * (really it isn't necessary for them). However, when you get 16-bit numbers,
 * you do. Let's go back to our prior example and see how this will look:
 *
 * (0xffff - 0xff80 + 1) * -1
 * (0x007f + 1) * -1
 * (0x0080) * -1
 */
Buffer.prototype.readInt8 = function(offset, noAssert) {
  var buffer = this;
  var neg;

  if (!noAssert) {
    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to read beyond buffer length');
  }

  neg = buffer.parent[buffer.offset + offset] & 0x80;
  if (!neg) {
    return (buffer.parent[buffer.offset + offset]);
  }

  return ((0xff - buffer.parent[buffer.offset + offset] + 1) * -1);
};

function readInt16(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt16(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x8000;
  if (!neg) {
    return val;
  }

  return (0xffff - val + 1) * -1;
}

Buffer.prototype.readInt16LE = function(offset, noAssert) {
  return readInt16(this, offset, false, noAssert);
};

Buffer.prototype.readInt16BE = function(offset, noAssert) {
  return readInt16(this, offset, true, noAssert);
};

function readInt32(buffer, offset, isBigEndian, noAssert) {
  var neg, val;

  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  val = readUInt32(buffer, offset, isBigEndian, noAssert);
  neg = val & 0x80000000;
  if (!neg) {
    return (val);
  }

  return (0xffffffff - val + 1) * -1;
}

Buffer.prototype.readInt32LE = function(offset, noAssert) {
  return readInt32(this, offset, false, noAssert);
};

Buffer.prototype.readInt32BE = function(offset, noAssert) {
  return readInt32(this, offset, true, noAssert);
};

function readFloat(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 3 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.readFloatLE = function(offset, noAssert) {
  return readFloat(this, offset, false, noAssert);
};

Buffer.prototype.readFloatBE = function(offset, noAssert) {
  return readFloat(this, offset, true, noAssert);
};

function readDouble(buffer, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset + 7 < buffer.length,
        'Trying to read beyond buffer length');
  }

  return require('./buffer_ieee754').readIEEE754(buffer, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.readDoubleLE = function(offset, noAssert) {
  return readDouble(this, offset, false, noAssert);
};

Buffer.prototype.readDoubleBE = function(offset, noAssert) {
  return readDouble(this, offset, true, noAssert);
};


/*
 * We have to make sure that the value is a valid integer. This means that it is
 * non-negative. It has no fractional component and that it does not exceed the
 * maximum allowed value.
 *
 *      value           The number to check for validity
 *
 *      max             The maximum value
 */
function verifuint(value, max) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value >= 0,
      'specified a negative value for writing an unsigned value');

  assert.ok(value <= max, 'value is larger than maximum value for type');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

Buffer.prototype.writeUInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xff);
  }

  buffer.parent[buffer.offset + offset] = value;
};

function writeUInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset + 1] = value & 0x00ff;
  } else {
    buffer.parent[buffer.offset + offset + 1] = (value & 0xff00) >>> 8;
    buffer.parent[buffer.offset + offset] = value & 0x00ff;
  }
}

Buffer.prototype.writeUInt16LE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt16BE = function(value, offset, noAssert) {
  writeUInt16(this, value, offset, true, noAssert);
};

function writeUInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'trying to write beyond buffer length');

    verifuint(value, 0xffffffff);
  }

  if (isBigEndian) {
    buffer.parent[buffer.offset + offset] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset + 3] = value & 0xff;
  } else {
    buffer.parent[buffer.offset + offset + 3] = (value >>> 24) & 0xff;
    buffer.parent[buffer.offset + offset + 2] = (value >>> 16) & 0xff;
    buffer.parent[buffer.offset + offset + 1] = (value >>> 8) & 0xff;
    buffer.parent[buffer.offset + offset] = value & 0xff;
  }
}

Buffer.prototype.writeUInt32LE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
  writeUInt32(this, value, offset, true, noAssert);
};


/*
 * We now move onto our friends in the signed number category. Unlike unsigned
 * numbers, we're going to have to worry a bit more about how we put values into
 * arrays. Since we are only worrying about signed 32-bit values, we're in
 * slightly better shape. Unfortunately, we really can't do our favorite binary
 * & in this system. It really seems to do the wrong thing. For example:
 *
 * > -32 & 0xff
 * 224
 *
 * What's happening above is really: 0xe0 & 0xff = 0xe0. However, the results of
 * this aren't treated as a signed number. Ultimately a bad thing.
 *
 * What we're going to want to do is basically create the unsigned equivalent of
 * our representation and pass that off to the wuint* functions. To do that
 * we're going to do the following:
 *
 *  - if the value is positive
 *      we can pass it directly off to the equivalent wuint
 *  - if the value is negative
 *      we do the following computation:
 *         mb + val + 1, where
 *         mb   is the maximum unsigned value in that byte size
 *         val  is the Javascript negative integer
 *
 *
 * As a concrete value, take -128. In signed 16 bits this would be 0xff80. If
 * you do out the computations:
 *
 * 0xffff - 128 + 1
 * 0xffff - 127
 * 0xff80
 *
 * You can then encode this value as the signed version. This is really rather
 * hacky, but it should work and get the job done which is our goal here.
 */

/*
 * A series of checks to make sure we actually have a signed 32-bit number
 */
function verifsint(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');

  assert.ok(Math.floor(value) === value, 'value has a fractional component');
}

function verifIEEE754(value, max, min) {
  assert.ok(typeof (value) == 'number',
      'cannot write a non-number as a number');

  assert.ok(value <= max, 'value larger than maximum allowed value');

  assert.ok(value >= min, 'value smaller than minimum allowed value');
}

Buffer.prototype.writeInt8 = function(value, offset, noAssert) {
  var buffer = this;

  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7f, -0x80);
  }

  if (value >= 0) {
    buffer.writeUInt8(value, offset, noAssert);
  } else {
    buffer.writeUInt8(0xff + value + 1, offset, noAssert);
  }
};

function writeInt16(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 1 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fff, -0x8000);
  }

  if (value >= 0) {
    writeUInt16(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt16(buffer, 0xffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt16LE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt16BE = function(value, offset, noAssert) {
  writeInt16(this, value, offset, true, noAssert);
};

function writeInt32(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifsint(value, 0x7fffffff, -0x80000000);
  }

  if (value >= 0) {
    writeUInt32(buffer, value, offset, isBigEndian, noAssert);
  } else {
    writeUInt32(buffer, 0xffffffff + value + 1, offset, isBigEndian, noAssert);
  }
}

Buffer.prototype.writeInt32LE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, false, noAssert);
};

Buffer.prototype.writeInt32BE = function(value, offset, noAssert) {
  writeInt32(this, value, offset, true, noAssert);
};

function writeFloat(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 3 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      23, 4);
}

Buffer.prototype.writeFloatLE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, false, noAssert);
};

Buffer.prototype.writeFloatBE = function(value, offset, noAssert) {
  writeFloat(this, value, offset, true, noAssert);
};

function writeDouble(buffer, value, offset, isBigEndian, noAssert) {
  if (!noAssert) {
    assert.ok(value !== undefined && value !== null,
        'missing value');

    assert.ok(typeof (isBigEndian) === 'boolean',
        'missing or invalid endian');

    assert.ok(offset !== undefined && offset !== null,
        'missing offset');

    assert.ok(offset + 7 < buffer.length,
        'Trying to write beyond buffer length');

    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308);
  }

  require('./buffer_ieee754').writeIEEE754(buffer, value, offset, isBigEndian,
      52, 8);
}

Buffer.prototype.writeDoubleLE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, false, noAssert);
};

Buffer.prototype.writeDoubleBE = function(value, offset, noAssert) {
  writeDouble(this, value, offset, true, noAssert);
};

SlowBuffer.prototype.readUInt8 = Buffer.prototype.readUInt8;
SlowBuffer.prototype.readUInt16LE = Buffer.prototype.readUInt16LE;
SlowBuffer.prototype.readUInt16BE = Buffer.prototype.readUInt16BE;
SlowBuffer.prototype.readUInt32LE = Buffer.prototype.readUInt32LE;
SlowBuffer.prototype.readUInt32BE = Buffer.prototype.readUInt32BE;
SlowBuffer.prototype.readInt8 = Buffer.prototype.readInt8;
SlowBuffer.prototype.readInt16LE = Buffer.prototype.readInt16LE;
SlowBuffer.prototype.readInt16BE = Buffer.prototype.readInt16BE;
SlowBuffer.prototype.readInt32LE = Buffer.prototype.readInt32LE;
SlowBuffer.prototype.readInt32BE = Buffer.prototype.readInt32BE;
SlowBuffer.prototype.readFloatLE = Buffer.prototype.readFloatLE;
SlowBuffer.prototype.readFloatBE = Buffer.prototype.readFloatBE;
SlowBuffer.prototype.readDoubleLE = Buffer.prototype.readDoubleLE;
SlowBuffer.prototype.readDoubleBE = Buffer.prototype.readDoubleBE;
SlowBuffer.prototype.writeUInt8 = Buffer.prototype.writeUInt8;
SlowBuffer.prototype.writeUInt16LE = Buffer.prototype.writeUInt16LE;
SlowBuffer.prototype.writeUInt16BE = Buffer.prototype.writeUInt16BE;
SlowBuffer.prototype.writeUInt32LE = Buffer.prototype.writeUInt32LE;
SlowBuffer.prototype.writeUInt32BE = Buffer.prototype.writeUInt32BE;
SlowBuffer.prototype.writeInt8 = Buffer.prototype.writeInt8;
SlowBuffer.prototype.writeInt16LE = Buffer.prototype.writeInt16LE;
SlowBuffer.prototype.writeInt16BE = Buffer.prototype.writeInt16BE;
SlowBuffer.prototype.writeInt32LE = Buffer.prototype.writeInt32LE;
SlowBuffer.prototype.writeInt32BE = Buffer.prototype.writeInt32BE;
SlowBuffer.prototype.writeFloatLE = Buffer.prototype.writeFloatLE;
SlowBuffer.prototype.writeFloatBE = Buffer.prototype.writeFloatBE;
SlowBuffer.prototype.writeDoubleLE = Buffer.prototype.writeDoubleLE;
SlowBuffer.prototype.writeDoubleBE = Buffer.prototype.writeDoubleBE;

},{"assert":1,"./buffer_ieee754":8,"base64-js":9}],9:[function(require,module,exports){
(function (exports) {
	'use strict';

	var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	function b64ToByteArray(b64) {
		var i, j, l, tmp, placeHolders, arr;
	
		if (b64.length % 4 > 0) {
			throw 'Invalid string. Length must be a multiple of 4';
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		placeHolders = b64.indexOf('=');
		placeHolders = placeHolders > 0 ? b64.length - placeHolders : 0;

		// base64 is 4/3 + up to two characters of the original data
		arr = [];//new Uint8Array(b64.length * 3 / 4 - placeHolders);

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length;

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (lookup.indexOf(b64[i]) << 18) | (lookup.indexOf(b64[i + 1]) << 12) | (lookup.indexOf(b64[i + 2]) << 6) | lookup.indexOf(b64[i + 3]);
			arr.push((tmp & 0xFF0000) >> 16);
			arr.push((tmp & 0xFF00) >> 8);
			arr.push(tmp & 0xFF);
		}

		if (placeHolders === 2) {
			tmp = (lookup.indexOf(b64[i]) << 2) | (lookup.indexOf(b64[i + 1]) >> 4);
			arr.push(tmp & 0xFF);
		} else if (placeHolders === 1) {
			tmp = (lookup.indexOf(b64[i]) << 10) | (lookup.indexOf(b64[i + 1]) << 4) | (lookup.indexOf(b64[i + 2]) >> 2);
			arr.push((tmp >> 8) & 0xFF);
			arr.push(tmp & 0xFF);
		}

		return arr;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1];
				output += lookup[temp >> 2];
				output += lookup[(temp << 4) & 0x3F];
				output += '==';
				break;
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1]);
				output += lookup[temp >> 10];
				output += lookup[(temp >> 4) & 0x3F];
				output += lookup[(temp << 2) & 0x3F];
				output += '=';
				break;
		}

		return output;
	}

	module.exports.toByteArray = b64ToByteArray;
	module.exports.fromByteArray = uint8ToBase64;
}());

},{}]},{},[])
;;module.exports=require("buffer-browserify")

},{}],64:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],65:[function(require,module,exports){
(function () {
    "use strict";

    function defineHt(_) {


        var hashFunction = function (key) {
            if (typeof key === "string") {
                return key;
            } else if (typeof key === "object") {
                return  key.hashCode ? key.hashCode() : "" + key;
            } else {
                return "" + key;
            }
        };

        var Bucket = _.declare({

            instance: {

                constructor: function () {
                    this.__entries = [];
                    this.__keys = [];
                    this.__values = [];
                },

                pushValue: function (key, value) {
                    this.__keys.push(key);
                    this.__values.push(value);
                    this.__entries.push({key: key, value: value});
                    return value;
                },

                remove: function (key) {
                    var ret = null, map = this.__entries, val, keys = this.__keys, vals = this.__values;
                    var i = map.length - 1;
                    for (; i >= 0; i--) {
                        if (!!(val = map[i]) && val.key === key) {
                            map.splice(i, 1);
                            keys.splice(i, 1);
                            vals.splice(i, 1);
                            return val.value;
                        }
                    }
                    return ret;
                },

                "set": function (key, value) {
                    var ret = null, map = this.__entries, vals = this.__values;
                    var i = map.length - 1;
                    for (; i >= 0; i--) {
                        var val = map[i];
                        if (val && key === val.key) {
                            vals[i] = value;
                            val.value = value;
                            ret = value;
                            break;
                        }
                    }
                    if (!ret) {
                        map.push({key: key, value: value});
                    }
                    return ret;
                },

                find: function (key) {
                    var ret = null, map = this.__entries, val;
                    var i = map.length - 1;
                    for (; i >= 0; i--) {
                        val = map[i];
                        if (val && key === val.key) {
                            ret = val.value;
                            break;
                        }
                    }
                    return ret;
                },

                getEntrySet: function () {
                    return this.__entries;
                },

                getKeys: function () {
                    return this.__keys;
                },

                getValues: function (arr) {
                    return this.__values;
                }
            }
        });

        return _.declare({

            instance: {

                constructor: function () {
                    this.__map = {};
                },

                entrySet: function () {
                    var ret = [], map = this.__map;
                    for (var i in map) {
                        if (map.hasOwnProperty(i)) {
                            ret = ret.concat(map[i].getEntrySet());
                        }
                    }
                    return ret;
                },

                put: function (key, value) {
                    var hash = hashFunction(key);
                    var bucket = null;
                    if (!(bucket = this.__map[hash])) {
                        bucket = (this.__map[hash] = new Bucket());
                    }
                    bucket.pushValue(key, value);
                    return value;
                },

                remove: function (key) {
                    var hash = hashFunction(key), ret = null;
                    var bucket = this.__map[hash];
                    if (bucket) {
                        ret = bucket.remove(key);
                    }
                    return ret;
                },

                "get": function (key) {
                    var hash = hashFunction(key), ret = null, bucket;
                    if (!!(bucket = this.__map[hash])) {
                        ret = bucket.find(key);
                    }
                    return ret;
                },

                "set": function (key, value) {
                    var hash = hashFunction(key), ret = null, bucket = null, map = this.__map;
                    if (!!(bucket = map[hash])) {
                        ret = bucket.set(key, value);
                    } else {
                        ret = (map[hash] = new Bucket()).pushValue(key, value);
                    }
                    return ret;
                },

                contains: function (key) {
                    var hash = hashFunction(key), ret = false, bucket = null;
                    if (!!(bucket = this.__map[hash])) {
                        ret = !!(bucket.find(key));
                    }
                    return ret;
                },

                concat: function (hashTable) {
                    if (hashTable instanceof this._static) {
                        var ret = new this._static();
                        var otherEntrySet = hashTable.entrySet().concat(this.entrySet());
                        for (var i = otherEntrySet.length - 1; i >= 0; i--) {
                            var e = otherEntrySet[i];
                            ret.put(e.key, e.value);
                        }
                        return ret;
                    } else {
                        throw new TypeError("When joining hashtables the joining arg must be a HashTable");
                    }
                },

                filter: function (cb, scope) {
                    var es = this.entrySet(), ret = new this._static();
                    es = _.filter(es, cb, scope);
                    for (var i = es.length - 1; i >= 0; i--) {
                        var e = es[i];
                        ret.put(e.key, e.value);
                    }
                    return ret;
                },

                forEach: function (cb, scope) {
                    var es = this.entrySet();
                    _.forEach(es, cb, scope);
                },

                every: function (cb, scope) {
                    var es = this.entrySet();
                    return _.every(es, cb, scope);
                },

                map: function (cb, scope) {
                    var es = this.entrySet();
                    return _.map(es, cb, scope);
                },

                some: function (cb, scope) {
                    var es = this.entrySet();
                    return _.some(es, cb, scope);
                },

                reduce: function (cb, scope) {
                    var es = this.entrySet();
                    return _.reduce(es, cb, scope);
                },

                reduceRight: function (cb, scope) {
                    var es = this.entrySet();
                    return _.reduceRight(es, cb, scope);
                },

                clear: function () {
                    this.__map = {};
                },

                keys: function () {
                    var ret = [], map = this.__map;
                    for (var i in map) {
                        //if (map.hasOwnProperty(i)) {
                        ret = ret.concat(map[i].getKeys());
                        //}
                    }
                    return ret;
                },

                values: function () {
                    var ret = [], map = this.__map;
                    for (var i in map) {
                        //if (map.hasOwnProperty(i)) {
                        ret = ret.concat(map[i].getValues());
                        //}
                    }
                    return ret;
                },

                isEmpty: function () {
                    return this.keys().length === 0;
                }
            }

        });


    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineHt(require("extended")().register("declare", require("declare.js")).register(require("is-extended")).register(require("array-extended")));

        }
    } else if ("function" === typeof define) {
        define(["extended", "declare", "is-extended", "array-extended"], function (extended, declare, is, array) {
            return defineHt(extended().register("declare", declare).register(is).register(array));
        });
    } else {
        this.Ht = defineHt(this.extended().register("declare", this.declare).register(this.isExtended).register(this.arrayExtended));
    }

}).call(this);







},{"array-extended":52,"declare.js":55,"extended":56,"is-extended":66}],66:[function(require,module,exports){
var Buffer=require("__browserify_Buffer").Buffer;(function () {
    "use strict";

    function defineIsa(extended) {

        var pSlice = Array.prototype.slice;

        var hasOwn = Object.prototype.hasOwnProperty;
        var toStr = Object.prototype.toString;

        function argsToArray(args, slice) {
            var i = -1, j = 0, l = args.length, ret = [];
            slice = slice || 0;
            i += slice;
            while (++i < l) {
                ret[j++] = args[i];
            }
            return ret;
        }

        function keys(obj) {
            var ret = [];
            for (var i in obj) {
                if (hasOwn.call(obj, i)) {
                    ret.push(i);
                }
            }
            return ret;
        }

        //taken from node js assert.js
        //https://github.com/joyent/node/blob/master/lib/assert.js
        function deepEqual(actual, expected) {
            // 7.1. All identical values are equivalent, as determined by ===.
            if (actual === expected) {
                return true;

            } else if (typeof Buffer !== "undefined" && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
                if (actual.length !== expected.length) {
                    return false;
                }
                for (var i = 0; i < actual.length; i++) {
                    if (actual[i] !== expected[i]) {
                        return false;
                    }
                }
                return true;

                // 7.2. If the expected value is a Date object, the actual value is
                // equivalent if it is also a Date object that refers to the same time.
            } else if (isDate(actual) && isDate(expected)) {
                return actual.getTime() === expected.getTime();

                // 7.3 If the expected value is a RegExp object, the actual value is
                // equivalent if it is also a RegExp object with the same source and
                // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
            } else if (isRegExp(actual) && isRegExp(expected)) {
                return actual.source === expected.source &&
                    actual.global === expected.global &&
                    actual.multiline === expected.multiline &&
                    actual.lastIndex === expected.lastIndex &&
                    actual.ignoreCase === expected.ignoreCase;

                // 7.4. Other pairs that do not both pass typeof value == 'object',
                // equivalence is determined by ==.
            } else if (isString(actual) && isString(expected) && actual !== expected) {
                return false;
            } else if (typeof actual !== 'object' && typeof expected !== 'object') {
                return actual === expected;

                // 7.5 For all other Object pairs, including Array objects, equivalence is
                // determined by having the same number of owned properties (as verified
                // with Object.prototype.hasOwnProperty.call), the same set of keys
                // (although not necessarily the same order), equivalent values for every
                // corresponding key, and an identical 'prototype' property. Note: this
                // accounts for both named and indexed properties on Arrays.
            } else {
                return objEquiv(actual, expected);
            }
        }


        function objEquiv(a, b) {
            var key;
            if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) {
                return false;
            }
            // an identical 'prototype' property.
            if (a.prototype !== b.prototype) {
                return false;
            }
            //~~~I've managed to break Object.keys through screwy arguments passing.
            //   Converting to array solves the problem.
            if (isArguments(a)) {
                if (!isArguments(b)) {
                    return false;
                }
                a = pSlice.call(a);
                b = pSlice.call(b);
                return deepEqual(a, b);
            }
            try {
                var ka = keys(a),
                    kb = keys(b),
                    i;
                // having the same number of owned properties (keys incorporates
                // hasOwnProperty)
                if (ka.length !== kb.length) {
                    return false;
                }
                //the same set of keys (although not necessarily the same order),
                ka.sort();
                kb.sort();
                //~~~cheap key test
                for (i = ka.length - 1; i >= 0; i--) {
                    if (ka[i] !== kb[i]) {
                        return false;
                    }
                }
                //equivalent values for every corresponding key, and
                //~~~possibly expensive deep test
                for (i = ka.length - 1; i >= 0; i--) {
                    key = ka[i];
                    if (!deepEqual(a[key], b[key])) {
                        return false;
                    }
                }
            } catch (e) {//happens when one is a string literal and the other isn't
                return false;
            }
            return true;
        }


        var isFunction = function (obj) {
            return toStr.call(obj) === '[object Function]';
        };

        //ie hack
        if ("undefined" !== typeof window && !isFunction(window.alert)) {
            (function (alert) {
                isFunction = function (obj) {
                    return toStr.call(obj) === '[object Function]' || obj === alert;
                };
            }(window.alert));
        }

        function isObject(obj) {
            var undef;
            return obj !== null && typeof obj === "object";
        }

        function isHash(obj) {
            var ret = isObject(obj);
            return ret && obj.constructor === Object && !obj.nodeType && !obj.setInterval;
        }

        function isEmpty(object) {
            if (isArguments(object)) {
                return object.length === 0;
            } else if (isObject(object)) {
                return keys(object).length === 0;
            } else if (isString(object) || isArray(object)) {
                return object.length === 0;
            }
            return true;
        }

        function isBoolean(obj) {
            return obj === true || obj === false || toStr.call(obj) === "[object Boolean]";
        }

        function isUndefined(obj) {
            return typeof obj === 'undefined';
        }

        function isDefined(obj) {
            return !isUndefined(obj);
        }

        function isUndefinedOrNull(obj) {
            return isUndefined(obj) || isNull(obj);
        }

        function isNull(obj) {
            return obj === null;
        }


        var isArguments = function _isArguments(object) {
            return toStr.call(object) === '[object Arguments]';
        };

        if (!isArguments(arguments)) {
            isArguments = function _isArguments(obj) {
                return !!(obj && hasOwn.call(obj, "callee"));
            };
        }


        function isInstanceOf(obj, clazz) {
            if (isFunction(clazz)) {
                return obj instanceof clazz;
            } else {
                return false;
            }
        }

        function isRegExp(obj) {
            return toStr.call(obj) === '[object RegExp]';
        }

        var isArray = Array.isArray || function isArray(obj) {
            return toStr.call(obj) === "[object Array]";
        };

        function isDate(obj) {
            return toStr.call(obj) === '[object Date]';
        }

        function isString(obj) {
            return toStr.call(obj) === '[object String]';
        }

        function isNumber(obj) {
            return toStr.call(obj) === '[object Number]';
        }

        function isTrue(obj) {
            return obj === true;
        }

        function isFalse(obj) {
            return obj === false;
        }

        function isNotNull(obj) {
            return !isNull(obj);
        }

        function isEq(obj, obj2) {
            /*jshint eqeqeq:false*/
            return obj == obj2;
        }

        function isNeq(obj, obj2) {
            /*jshint eqeqeq:false*/
            return obj != obj2;
        }

        function isSeq(obj, obj2) {
            return obj === obj2;
        }

        function isSneq(obj, obj2) {
            return obj !== obj2;
        }

        function isIn(obj, arr) {
            if ((isArray(arr) && Array.prototype.indexOf) || isString(arr)) {
                return arr.indexOf(obj) > -1;
            } else if (isArray(arr)) {
                for (var i = 0, l = arr.length; i < l; i++) {
                    if (isEq(obj, arr[i])) {
                        return true;
                    }
                }
            }
            return false;
        }

        function isNotIn(obj, arr) {
            return !isIn(obj, arr);
        }

        function isLt(obj, obj2) {
            return obj < obj2;
        }

        function isLte(obj, obj2) {
            return obj <= obj2;
        }

        function isGt(obj, obj2) {
            return obj > obj2;
        }

        function isGte(obj, obj2) {
            return obj >= obj2;
        }

        function isLike(obj, reg) {
            if (isString(reg)) {
                return ("" + obj).match(reg) !== null;
            } else if (isRegExp(reg)) {
                return reg.test(obj);
            }
            return false;
        }

        function isNotLike(obj, reg) {
            return !isLike(obj, reg);
        }

        function contains(arr, obj) {
            return isIn(obj, arr);
        }

        function notContains(arr, obj) {
            return !isIn(obj, arr);
        }

        function containsAt(arr, obj, index) {
            if (isArray(arr) && arr.length > index) {
                return isEq(arr[index], obj);
            }
            return false;
        }

        function notContainsAt(arr, obj, index) {
            if (isArray(arr)) {
                return !isEq(arr[index], obj);
            }
            return false;
        }

        function has(obj, prop) {
            return hasOwn.call(obj, prop);
        }

        function notHas(obj, prop) {
            return !has(obj, prop);
        }

        function length(obj, l) {
            if (has(obj, "length")) {
                return obj.length === l;
            }
            return false;
        }

        function notLength(obj, l) {
            if (has(obj, "length")) {
                return obj.length !== l;
            }
            return false;
        }

        var isa = {
            isFunction: isFunction,
            isObject: isObject,
            isEmpty: isEmpty,
            isHash: isHash,
            isNumber: isNumber,
            isString: isString,
            isDate: isDate,
            isArray: isArray,
            isBoolean: isBoolean,
            isUndefined: isUndefined,
            isDefined: isDefined,
            isUndefinedOrNull: isUndefinedOrNull,
            isNull: isNull,
            isArguments: isArguments,
            instanceOf: isInstanceOf,
            isRegExp: isRegExp,
            deepEqual: deepEqual,
            isTrue: isTrue,
            isFalse: isFalse,
            isNotNull: isNotNull,
            isEq: isEq,
            isNeq: isNeq,
            isSeq: isSeq,
            isSneq: isSneq,
            isIn: isIn,
            isNotIn: isNotIn,
            isLt: isLt,
            isLte: isLte,
            isGt: isGt,
            isGte: isGte,
            isLike: isLike,
            isNotLike: isNotLike,
            contains: contains,
            notContains: notContains,
            has: has,
            notHas: notHas,
            isLength: length,
            isNotLength: notLength,
            containsAt: containsAt,
            notContainsAt: notContainsAt
        };

        var tester = {
            constructor: function () {
                this._testers = [];
            },

            noWrap: {
                tester: function () {
                    var testers = this._testers;
                    return function tester(value) {
                        var isa = false;
                        for (var i = 0, l = testers.length; i < l && !isa; i++) {
                            isa = testers[i](value);
                        }
                        return isa;
                    };
                }
            }
        };

        var switcher = {
            constructor: function () {
                this._cases = [];
                this.__default = null;
            },

            def: function (val, fn) {
                this.__default = fn;
            },

            noWrap: {
                switcher: function () {
                    var testers = this._cases, __default = this.__default;
                    return function tester() {
                        var handled = false, args = argsToArray(arguments), caseRet;
                        for (var i = 0, l = testers.length; i < l && !handled; i++) {
                            caseRet = testers[i](args);
                            if (caseRet.length > 1) {
                                if (caseRet[1] || caseRet[0]) {
                                    return caseRet[1];
                                }
                            }
                        }
                        if (!handled && __default) {
                            return  __default.apply(this, args);
                        }
                    };
                }
            }
        };

        function addToTester(func) {
            tester[func] = function isaTester() {
                this._testers.push(isa[func]);
            };
        }

        function addToSwitcher(func) {
            switcher[func] = function isaTester() {
                var args = argsToArray(arguments, 1), isFunc = isa[func], handler, doBreak = true;
                if (args.length <= isFunc.length - 1) {
                    throw new TypeError("A handler must be defined when calling using switch");
                } else {
                    handler = args.pop();
                    if (isBoolean(handler)) {
                        doBreak = handler;
                        handler = args.pop();
                    }
                }
                if (!isFunction(handler)) {
                    throw new TypeError("handler must be defined");
                }
                this._cases.push(function (testArgs) {
                    if (isFunc.apply(isa, testArgs.concat(args))) {
                        return [doBreak, handler.apply(this, testArgs)];
                    }
                    return [false];
                });
            };
        }

        for (var i in isa) {
            if (hasOwn.call(isa, i)) {
                addToSwitcher(i);
                addToTester(i);
            }
        }

        var is = extended.define(isa).expose(isa);
        is.tester = extended.define(tester);
        is.switcher = extended.define(switcher);
        return is;

    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineIsa(require("extended"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended"], function (extended) {
            return defineIsa(extended);
        });
    } else {
        this.isExtended = defineIsa(this.extended);
    }

}).call(this);


},{"__browserify_Buffer":63,"extended":56}],67:[function(require,module,exports){
(function () {
    "use strict";

    function defineLeafy(_) {

        function compare(a, b) {
            var ret = 0;
            if (a > b) {
                return 1;
            } else if (a < b) {
                return -1;
            } else if (!b) {
                return 1;
            }
            return ret;
        }

        var multiply = _.multiply;

        var Tree = _.declare({

            instance: {

                /**
                 * Prints a node
                 * @param node node to print
                 * @param level the current level the node is at, Used for formatting
                 */
                __printNode: function (node, level) {
                    //console.log(level);
                    var str = [];
                    if (_.isUndefinedOrNull(node)) {
                        str.push(multiply('\t', level));
                        str.push("~");
                        console.log(str.join(""));
                    } else {
                        this.__printNode(node.right, level + 1);
                        str.push(multiply('\t', level));
                        str.push(node.data + "\n");
                        console.log(str.join(""));
                        this.__printNode(node.left, level + 1);
                    }
                },

                constructor: function (options) {
                    options = options || {};
                    this.compare = options.compare || compare;
                    this.__root = null;
                },

                insert: function () {
                    throw new Error("Not Implemented");
                },

                remove: function () {
                    throw new Error("Not Implemented");
                },

                clear: function () {
                    this.__root = null;
                },

                isEmpty: function () {
                    return !(this.__root);
                },

                traverseWithCondition: function (node, order, callback) {
                    var cont = true;
                    if (node) {
                        order = order || Tree.PRE_ORDER;
                        if (order === Tree.PRE_ORDER) {
                            cont = callback(node.data);
                            if (cont) {
                                cont = this.traverseWithCondition(node.left, order, callback);
                                if (cont) {
                                    cont = this.traverseWithCondition(node.right, order, callback);
                                }

                            }
                        } else if (order === Tree.IN_ORDER) {
                            cont = this.traverseWithCondition(node.left, order, callback);
                            if (cont) {
                                cont = callback(node.data);
                                if (cont) {
                                    cont = this.traverseWithCondition(node.right, order, callback);
                                }
                            }
                        } else if (order === Tree.POST_ORDER) {
                            cont = this.traverseWithCondition(node.left, order, callback);
                            if (cont) {
                                if (cont) {
                                    cont = this.traverseWithCondition(node.right, order, callback);
                                }
                                if (cont) {
                                    cont = callback(node.data);
                                }
                            }
                        } else if (order === Tree.REVERSE_ORDER) {
                            cont = this.traverseWithCondition(node.right, order, callback);
                            if (cont) {
                                cont = callback(node.data);
                                if (cont) {
                                    cont = this.traverseWithCondition(node.left, order, callback);
                                }
                            }
                        }
                    }
                    return cont;
                },

                traverse: function (node, order, callback) {
                    if (node) {
                        order = order || Tree.PRE_ORDER;
                        if (order === Tree.PRE_ORDER) {
                            callback(node.data);
                            this.traverse(node.left, order, callback);
                            this.traverse(node.right, order, callback);
                        } else if (order === Tree.IN_ORDER) {
                            this.traverse(node.left, order, callback);
                            callback(node.data);
                            this.traverse(node.right, order, callback);
                        } else if (order === Tree.POST_ORDER) {
                            this.traverse(node.left, order, callback);
                            this.traverse(node.right, order, callback);
                            callback(node.data);
                        } else if (order === Tree.REVERSE_ORDER) {
                            this.traverse(node.right, order, callback);
                            callback(node.data);
                            this.traverse(node.left, order, callback);

                        }
                    }
                },

                forEach: function (cb, scope, order) {
                    if (typeof cb !== "function") {
                        throw new TypeError();
                    }
                    order = order || Tree.IN_ORDER;
                    scope = scope || this;
                    this.traverse(this.__root, order, function (node) {
                        cb.call(scope, node, this);
                    });
                },

                map: function (cb, scope, order) {
                    if (typeof cb !== "function") {
                        throw new TypeError();
                    }

                    order = order || Tree.IN_ORDER;
                    scope = scope || this;
                    var ret = new this._static();
                    this.traverse(this.__root, order, function (node) {
                        ret.insert(cb.call(scope, node, this));
                    });
                    return ret;
                },

                filter: function (cb, scope, order) {
                    if (typeof cb !== "function") {
                        throw new TypeError();
                    }

                    order = order || Tree.IN_ORDER;
                    scope = scope || this;
                    var ret = new this._static();
                    this.traverse(this.__root, order, function (node) {
                        if (cb.call(scope, node, this)) {
                            ret.insert(node);
                        }
                    });
                    return ret;
                },

                reduce: function (fun, accumulator, order) {
                    var arr = this.toArray(order);
                    var args = [arr, fun];
                    if (!_.isUndefinedOrNull(accumulator)) {
                        args.push(accumulator);
                    }
                    return _.reduce.apply(_, args);
                },

                reduceRight: function (fun, accumulator, order) {
                    var arr = this.toArray(order);
                    var args = [arr, fun];
                    if (!_.isUndefinedOrNull(accumulator)) {
                        args.push(accumulator);
                    }
                    return _.reduceRight.apply(_, args);
                },

                every: function (cb, scope, order) {
                    if (typeof cb !== "function") {
                        throw new TypeError();
                    }
                    order = order || Tree.IN_ORDER;
                    scope = scope || this;
                    var ret = false;
                    this.traverseWithCondition(this.__root, order, function (node) {
                        ret = cb.call(scope, node, this);
                        return ret;
                    });
                    return ret;
                },

                some: function (cb, scope, order) {
                    if (typeof cb !== "function") {
                        throw new TypeError();
                    }

                    order = order || Tree.IN_ORDER;
                    scope = scope || this;
                    var ret;
                    this.traverseWithCondition(this.__root, order, function (node) {
                        ret = cb.call(scope, node, this);
                        return !ret;
                    });
                    return ret;
                },

                toArray: function (order) {
                    order = order || Tree.IN_ORDER;
                    var arr = [];
                    this.traverse(this.__root, order, function (node) {
                        arr.push(node);
                    });
                    return arr;
                },

                contains: function (value) {
                    var ret = false;
                    var root = this.__root;
                    while (root !== null) {
                        var cmp = this.compare(value, root.data);
                        if (cmp) {
                            root = root[(cmp === -1) ? "left" : "right"];
                        } else {
                            ret = true;
                            root = null;
                        }
                    }
                    return ret;
                },

                find: function (value) {
                    var ret;
                    var root = this.__root;
                    while (root) {
                        var cmp = this.compare(value, root.data);
                        if (cmp) {
                            root = root[(cmp === -1) ? "left" : "right"];
                        } else {
                            ret = root.data;
                            break;
                        }
                    }
                    return ret;
                },

                findLessThan: function (value, exclusive) {
                    //find a better way!!!!
                    var ret = [], compare = this.compare;
                    this.traverseWithCondition(this.__root, Tree.IN_ORDER, function (v) {
                        var cmp = compare(value, v);
                        if ((!exclusive && cmp === 0) || cmp === 1) {
                            ret.push(v);
                            return true;
                        } else {
                            return false;
                        }
                    });
                    return ret;
                },

                findGreaterThan: function (value, exclusive) {
                    //find a better way!!!!
                    var ret = [], compare = this.compare;
                    this.traverse(this.__root, Tree.REVERSE_ORDER, function (v) {
                        var cmp = compare(value, v);
                        if ((!exclusive && cmp === 0) || cmp === -1) {
                            ret.push(v);
                            return true;
                        } else {
                            return false;
                        }
                    });
                    return ret;
                },

                print: function () {
                    this.__printNode(this.__root, 0);
                }
            },

            "static": {
                PRE_ORDER: "pre_order",
                IN_ORDER: "in_order",
                POST_ORDER: "post_order",
                REVERSE_ORDER: "reverse_order"
            }
        });

        var AVLTree = (function () {
            var abs = Math.abs;


            var makeNode = function (data) {
                return {
                    data: data,
                    balance: 0,
                    left: null,
                    right: null
                };
            };

            var rotateSingle = function (root, dir, otherDir) {
                var save = root[otherDir];
                root[otherDir] = save[dir];
                save[dir] = root;
                return save;
            };


            var rotateDouble = function (root, dir, otherDir) {
                root[otherDir] = rotateSingle(root[otherDir], otherDir, dir);
                return rotateSingle(root, dir, otherDir);
            };

            var adjustBalance = function (root, dir, bal) {
                var otherDir = dir === "left" ? "right" : "left";
                var n = root[dir], nn = n[otherDir];
                if (nn.balance === 0) {
                    root.balance = n.balance = 0;
                } else if (nn.balance === bal) {
                    root.balance = -bal;
                    n.balance = 0;
                } else { /* nn.balance == -bal */
                    root.balance = 0;
                    n.balance = bal;
                }
                nn.balance = 0;
            };

            var insertAdjustBalance = function (root, dir) {
                var otherDir = dir === "left" ? "right" : "left";

                var n = root[dir];
                var bal = dir === "right" ? -1 : +1;

                if (n.balance === bal) {
                    root.balance = n.balance = 0;
                    root = rotateSingle(root, otherDir, dir);
                } else {
                    adjustBalance(root, dir, bal);
                    root = rotateDouble(root, otherDir, dir);
                }

                return root;

            };

            var removeAdjustBalance = function (root, dir, done) {
                var otherDir = dir === "left" ? "right" : "left";
                var n = root[otherDir];
                var bal = dir === "right" ? -1 : 1;
                if (n.balance === -bal) {
                    root.balance = n.balance = 0;
                    root = rotateSingle(root, dir, otherDir);
                } else if (n.balance === bal) {
                    adjustBalance(root, otherDir, -bal);
                    root = rotateDouble(root, dir, otherDir);
                } else { /* n.balance == 0 */
                    root.balance = -bal;
                    n.balance = bal;
                    root = rotateSingle(root, dir, otherDir);
                    done.done = true;
                }
                return root;
            };

            function insert(tree, data, cmp) {
                /* Empty tree case */
                var root = tree.__root;
                if (root === null || root === undefined) {
                    tree.__root = makeNode(data);
                } else {
                    var it = root, upd = [], up = [], top = 0, dir;
                    while (true) {
                        dir = upd[top] = cmp(data, it.data) === -1 ? "left" : "right";
                        up[top++] = it;
                        if (!it[dir]) {
                            it[dir] = makeNode(data);
                            break;
                        }
                        it = it[dir];
                    }
                    if (!it[dir]) {
                        return null;
                    }
                    while (--top >= 0) {
                        up[top].balance += upd[top] === "right" ? -1 : 1;
                        if (up[top].balance === 0) {
                            break;
                        } else if (abs(up[top].balance) > 1) {
                            up[top] = insertAdjustBalance(up[top], upd[top]);
                            if (top !== 0) {
                                up[top - 1][upd[top - 1]] = up[top];
                            } else {
                                tree.__root = up[0];
                            }
                            break;
                        }
                    }
                }
            }

            function remove(tree, data, cmp) {
                var root = tree.__root;
                if (root !== null && root !== undefined) {
                    var it = root, top = 0, up = [], upd = [], done = {done: false}, dir, compare;
                    while (true) {
                        if (!it) {
                            return;
                        } else if ((compare = cmp(data, it.data)) === 0) {
                            break;
                        }
                        dir = upd[top] = compare === -1 ? "left" : "right";
                        up[top++] = it;
                        it = it[dir];
                    }
                    var l = it.left, r = it.right;
                    if (!l || !r) {
                        dir = !l ? "right" : "left";
                        if (top !== 0) {
                            up[top - 1][upd[top - 1]] = it[dir];
                        } else {
                            tree.__root = it[dir];
                        }
                    } else {
                        var heir = l;
                        upd[top] = "left";
                        up[top++] = it;
                        while (heir.right) {
                            upd[top] = "right";
                            up[top++] = heir;
                            heir = heir.right;
                        }
                        it.data = heir.data;
                        up[top - 1][up[top - 1] === it ? "left" : "right"] = heir.left;
                    }
                    while (--top >= 0 && !done.done) {
                        up[top].balance += upd[top] === "left" ? -1 : +1;
                        if (abs(up[top].balance) === 1) {
                            break;
                        } else if (abs(up[top].balance) > 1) {
                            up[top] = removeAdjustBalance(up[top], upd[top], done);
                            if (top !== 0) {
                                up[top - 1][upd[top - 1]] = up[top];
                            } else {
                                tree.__root = up[0];
                            }
                        }
                    }
                }
            }


            return Tree.extend({
                instance: {

                    insert: function (data) {
                        insert(this, data, this.compare);
                    },


                    remove: function (data) {
                        remove(this, data, this.compare);
                    },

                    __printNode: function (node, level) {
                        var str = [];
                        if (!node) {
                            str.push(multiply('\t', level));
                            str.push("~");
                            console.log(str.join(""));
                        } else {
                            this.__printNode(node.right, level + 1);
                            str.push(multiply('\t', level));
                            str.push(node.data + ":" + node.balance + "\n");
                            console.log(str.join(""));
                            this.__printNode(node.left, level + 1);
                        }
                    }

                }
            });
        }());

        var AnderssonTree = (function () {

            var nil = {level: 0, data: null};

            function makeNode(data, level) {
                return {
                    data: data,
                    level: level,
                    left: nil,
                    right: nil
                };
            }

            function skew(root) {
                if (root.level !== 0 && root.left.level === root.level) {
                    var save = root.left;
                    root.left = save.right;
                    save.right = root;
                    root = save;
                }
                return root;
            }

            function split(root) {
                if (root.level !== 0 && root.right.right.level === root.level) {
                    var save = root.right;
                    root.right = save.left;
                    save.left = root;
                    root = save;
                    root.level++;
                }
                return root;
            }

            function insert(root, data, compare) {
                if (root === nil) {
                    root = makeNode(data, 1);
                }
                else {
                    var dir = compare(data, root.data) === -1 ? "left" : "right";
                    root[dir] = insert(root[dir], data, compare);
                    root = skew(root);
                    root = split(root);
                }
                return root;
            }

            var remove = function (root, data, compare) {
                var rLeft, rRight;
                if (root !== nil) {
                    var cmp = compare(data, root.data);
                    if (cmp === 0) {
                        rLeft = root.left, rRight = root.right;
                        if (rLeft !== nil && rRight !== nil) {
                            var heir = rLeft;
                            while (heir.right !== nil) {
                                heir = heir.right;
                            }
                            root.data = heir.data;
                            root.left = remove(rLeft, heir.data, compare);
                        } else {
                            root = root[rLeft === nil ? "right" : "left"];
                        }
                    } else {
                        var dir = cmp === -1 ? "left" : "right";
                        root[dir] = remove(root[dir], data, compare);
                    }
                }
                if (root !== nil) {
                    var rLevel = root.level;
                    var rLeftLevel = root.left.level, rRightLevel = root.right.level;
                    if (rLeftLevel < rLevel - 1 || rRightLevel < rLevel - 1) {
                        if (rRightLevel > --root.level) {
                            root.right.level = root.level;
                        }
                        root = skew(root);
                        root = split(root);
                    }
                }
                return root;
            };

            return Tree.extend({

                instance: {

                    isEmpty: function () {
                        return this.__root === nil || this._super(arguments);
                    },

                    insert: function (data) {
                        if (!this.__root) {
                            this.__root = nil;
                        }
                        this.__root = insert(this.__root, data, this.compare);
                    },

                    remove: function (data) {
                        this.__root = remove(this.__root, data, this.compare);
                    },


                    traverseWithCondition: function (node) {
                        var cont = true;
                        if (node !== nil) {
                            return this._super(arguments);
                        }
                        return cont;
                    },


                    traverse: function (node) {
                        if (node !== nil) {
                            this._super(arguments);
                        }
                    },

                    contains: function () {
                        if (this.__root !== nil) {
                            return this._super(arguments);
                        }
                        return false;
                    },

                    __printNode: function (node, level) {
                        var str = [];
                        if (!node || !node.data) {
                            str.push(multiply('\t', level));
                            str.push("~");
                            console.log(str.join(""));
                        } else {
                            this.__printNode(node.right, level + 1);
                            str.push(multiply('\t', level));
                            str.push(node.data + ":" + node.level + "\n");
                            console.log(str.join(""));
                            this.__printNode(node.left, level + 1);
                        }
                    }

                }

            });
        }());

        var BinaryTree = Tree.extend({
            instance: {
                insert: function (data) {
                    if (!this.__root) {
                        this.__root = {
                            data: data,
                            parent: null,
                            left: null,
                            right: null
                        };
                        return this.__root;
                    }
                    var compare = this.compare;
                    var root = this.__root;
                    while (root !== null) {
                        var cmp = compare(data, root.data);
                        if (cmp) {
                            var leaf = (cmp === -1) ? "left" : "right";
                            var next = root[leaf];
                            if (!next) {
                                return (root[leaf] = {data: data, parent: root, left: null, right: null});
                            } else {
                                root = next;
                            }
                        } else {
                            return;
                        }
                    }
                },

                remove: function (data) {
                    if (this.__root !== null) {
                        var head = {right: this.__root}, it = head;
                        var p, f = null;
                        var dir = "right";
                        while (it[dir] !== null) {
                            p = it;
                            it = it[dir];
                            var cmp = this.compare(data, it.data);
                            if (!cmp) {
                                f = it;
                            }
                            dir = (cmp === -1 ? "left" : "right");
                        }
                        if (f !== null) {
                            f.data = it.data;
                            p[p.right === it ? "right" : "left"] = it[it.left === null ? "right" : "left"];
                        }
                        this.__root = head.right;
                    }

                }
            }
        });

        var RedBlackTree = (function () {
            var RED = "RED", BLACK = "BLACK";

            var isRed = function (node) {
                return node !== null && node.red;
            };

            var makeNode = function (data) {
                return {
                    data: data,
                    red: true,
                    left: null,
                    right: null
                };
            };

            var insert = function (root, data, compare) {
                if (!root) {
                    return makeNode(data);

                } else {
                    var cmp = compare(data, root.data);
                    if (cmp) {
                        var dir = cmp === -1 ? "left" : "right";
                        var otherDir = dir === "left" ? "right" : "left";
                        root[dir] = insert(root[dir], data, compare);
                        var node = root[dir];

                        if (isRed(node)) {

                            var sibling = root[otherDir];
                            if (isRed(sibling)) {
                                /* Case 1 */
                                root.red = true;
                                node.red = false;
                                sibling.red = false;
                            } else {

                                if (isRed(node[dir])) {

                                    root = rotateSingle(root, otherDir);
                                } else if (isRed(node[otherDir])) {

                                    root = rotateDouble(root, otherDir);
                                }
                            }

                        }
                    }
                }
                return root;
            };

            var rotateSingle = function (root, dir) {
                var otherDir = dir === "left" ? "right" : "left";
                var save = root[otherDir];
                root[otherDir] = save[dir];
                save[dir] = root;
                root.red = true;
                save.red = false;
                return save;
            };

            var rotateDouble = function (root, dir) {
                var otherDir = dir === "left" ? "right" : "left";
                root[otherDir] = rotateSingle(root[otherDir], otherDir);
                return rotateSingle(root, dir);
            };


            var remove = function (root, data, done, compare) {
                if (!root) {
                    done.done = true;
                } else {
                    var dir;
                    if (compare(data, root.data) === 0) {
                        if (!root.left || !root.right) {
                            var save = root[!root.left ? "right" : "left"];
                            /* Case 0 */
                            if (isRed(root)) {
                                done.done = true;
                            } else if (isRed(save)) {
                                save.red = false;
                                done.done = true;
                            }
                            return save;
                        }
                        else {
                            var heir = root.right, p;
                            while (heir.left !== null) {
                                p = heir;
                                heir = heir.left;
                            }
                            if (p) {
                                p.left = null;
                            }
                            root.data = heir.data;
                            data = heir.data;
                        }
                    }
                    dir = compare(data, root.data) === -1 ? "left" : "right";
                    root[dir] = remove(root[dir], data, done, compare);
                    if (!done.done) {
                        root = removeBalance(root, dir, done);
                    }
                }
                return root;
            };

            var removeBalance = function (root, dir, done) {
                var notDir = dir === "left" ? "right" : "left";
                var p = root, s = p[notDir];
                if (isRed(s)) {
                    root = rotateSingle(root, dir);
                    s = p[notDir];
                }
                if (s !== null) {
                    if (!isRed(s.left) && !isRed(s.right)) {
                        if (isRed(p)) {
                            done.done = true;
                        }
                        p.red = 0;
                        s.red = 1;
                    } else {
                        var save = p.red, newRoot = ( root === p );
                        p = (isRed(s[notDir]) ? rotateSingle : rotateDouble)(p, dir);
                        p.red = save;
                        p.left.red = p.right.red = 0;
                        if (newRoot) {
                            root = p;
                        } else {
                            root[dir] = p;
                        }
                        done.done = true;
                    }
                }
                return root;
            };

            return Tree.extend({
                instance: {
                    insert: function (data) {
                        this.__root = insert(this.__root, data, this.compare);
                        this.__root.red = false;
                    },

                    remove: function (data) {
                        var done = {done: false};
                        var root = remove(this.__root, data, done, this.compare);
                        if (root !== null) {
                            root.red = 0;
                        }
                        this.__root = root;
                        return data;
                    },


                    __printNode: function (node, level) {
                        var str = [];
                        if (!node) {
                            str.push(multiply('\t', level));
                            str.push("~");
                            console.log(str.join(""));
                        } else {
                            this.__printNode(node.right, level + 1);
                            str.push(multiply('\t', level));
                            str.push((node.red ? RED : BLACK) + ":" + node.data + "\n");
                            console.log(str.join(""));
                            this.__printNode(node.left, level + 1);
                        }
                    }

                }
            });

        }());


        return {
            Tree: Tree,
            AVLTree: AVLTree,
            AnderssonTree: AnderssonTree,
            BinaryTree: BinaryTree,
            RedBlackTree: RedBlackTree,
            IN_ORDER: Tree.IN_ORDER,
            PRE_ORDER: Tree.PRE_ORDER,
            POST_ORDER: Tree.POST_ORDER,
            REVERSE_ORDER: Tree.REVERSE_ORDER

        };
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineLeafy(require("extended")()
                .register("declare", require("declare.js"))
                .register(require("is-extended"))
                .register(require("array-extended"))
                .register(require("string-extended"))
            );

        }
    } else if ("function" === typeof define) {
        define(["extended", "declare.js", "is-extended", "array-extended", "string-extended"], function (extended, declare, is, array, string) {
            return defineLeafy(extended()
                .register("declare", declare)
                .register(is)
                .register(array)
                .register(string)
            );
        });
    } else {
        this.leafy = defineLeafy(this.extended()
            .register("declare", this.declare)
            .register(this.isExtended)
            .register(this.arrayExtended)
            .register(this.stringExtended));
    }

}).call(this);







},{"array-extended":52,"declare.js":55,"extended":56,"is-extended":66,"string-extended":70}],68:[function(require,module,exports){
(function () {
    "use strict";
    /*global extended isExtended*/

    function defineObject(extended, is, arr) {

        var deepEqual = is.deepEqual,
            isString = is.isString,
            isHash = is.isHash,
            difference = arr.difference,
            hasOwn = Object.prototype.hasOwnProperty,
            isFunction = is.isFunction;

        function _merge(target, source) {
            var name, s;
            for (name in source) {
                if (hasOwn.call(source, name)) {
                    s = source[name];
                    if (!(name in target) || (target[name] !== s)) {
                        target[name] = s;
                    }
                }
            }
            return target;
        }

        function _deepMerge(target, source) {
            var name, s, t;
            for (name in source) {
                if (hasOwn.call(source, name)) {
                    s = source[name];
                    t = target[name];
                    if (!deepEqual(t, s)) {
                        if (isHash(t) && isHash(s)) {
                            target[name] = _deepMerge(t, s);
                        } else if (isHash(s)) {
                            target[name] = _deepMerge({}, s);
                        } else {
                            target[name] = s;
                        }
                    }
                }
            }
            return target;
        }


        function merge(obj) {
            if (!obj) {
                obj = {};
            }
            for (var i = 1, l = arguments.length; i < l; i++) {
                _merge(obj, arguments[i]);
            }
            return obj; // Object
        }

        function deepMerge(obj) {
            if (!obj) {
                obj = {};
            }
            for (var i = 1, l = arguments.length; i < l; i++) {
                _deepMerge(obj, arguments[i]);
            }
            return obj; // Object
        }


        function extend(parent, child) {
            var proto = parent.prototype || parent;
            merge(proto, child);
            return parent;
        }

        function forEach(hash, iterator, scope) {
            if (!isHash(hash) || !isFunction(iterator)) {
                throw new TypeError();
            }
            var objKeys = keys(hash), key;
            for (var i = 0, len = objKeys.length; i < len; ++i) {
                key = objKeys[i];
                iterator.call(scope || hash, hash[key], key, hash);
            }
            return hash;
        }

        function filter(hash, iterator, scope) {
            if (!isHash(hash) || !isFunction(iterator)) {
                throw new TypeError();
            }
            var objKeys = keys(hash), key, value, ret = {};
            for (var i = 0, len = objKeys.length; i < len; ++i) {
                key = objKeys[i];
                value = hash[key];
                if (iterator.call(scope || hash, value, key, hash)) {
                    ret[key] = value;
                }
            }
            return ret;
        }

        function values(hash) {
            if (!isHash(hash)) {
                throw new TypeError();
            }
            var objKeys = keys(hash), ret = [];
            for (var i = 0, len = objKeys.length; i < len; ++i) {
                ret.push(hash[objKeys[i]]);
            }
            return ret;
        }


        function keys(hash) {
            if (!isHash(hash)) {
                throw new TypeError();
            }
            var ret = [];
            for (var i in hash) {
                if (hasOwn.call(hash, i)) {
                    ret.push(i);
                }
            }
            return ret;
        }

        function invert(hash) {
            if (!isHash(hash)) {
                throw new TypeError();
            }
            var objKeys = keys(hash), key, ret = {};
            for (var i = 0, len = objKeys.length; i < len; ++i) {
                key = objKeys[i];
                ret[hash[key]] = key;
            }
            return ret;
        }

        function toArray(hash) {
            if (!isHash(hash)) {
                throw new TypeError();
            }
            var objKeys = keys(hash), key, ret = [];
            for (var i = 0, len = objKeys.length; i < len; ++i) {
                key = objKeys[i];
                ret.push([key, hash[key]]);
            }
            return ret;
        }

        function omit(hash, omitted) {
            if (!isHash(hash)) {
                throw new TypeError();
            }
            if (isString(omitted)) {
                omitted = [omitted];
            }
            var objKeys = difference(keys(hash), omitted), key, ret = {};
            for (var i = 0, len = objKeys.length; i < len; ++i) {
                key = objKeys[i];
                ret[key] = hash[key];
            }
            return ret;
        }

        var hash = {
            forEach: forEach,
            filter: filter,
            invert: invert,
            values: values,
            toArray: toArray,
            keys: keys,
            omit: omit
        };


        var obj = {
            extend: extend,
            merge: merge,
            deepMerge: deepMerge,
            omit: omit
        };

        var ret = extended.define(is.isObject, obj).define(isHash, hash).define(is.isFunction, {extend: extend}).expose({hash: hash}).expose(obj);
        var orig = ret.extend;
        ret.extend = function __extend() {
            if (arguments.length === 1) {
                return orig.extend.apply(ret, arguments);
            } else {
                extend.apply(null, arguments);
            }
        };
        return ret;

    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineObject(require("extended"), require("is-extended"), require("array-extended"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended", "is-extended", "array-extended"], function (extended, is, array) {
            return defineObject(extended, is, array);
        });
    } else {
        this.objectExtended = defineObject(this.extended, this.isExtended, this.arrayExtended);
    }

}).call(this);







},{"array-extended":52,"extended":56,"is-extended":66}],69:[function(require,module,exports){
var process=require("__browserify_process");(function () {
    "use strict";
    /*global setImmediate, MessageChannel*/


    function definePromise(declare, extended, array, is, fn, args) {

        var forEach = array.forEach,
            isUndefinedOrNull = is.isUndefinedOrNull,
            isArray = is.isArray,
            isFunction = is.isFunction,
            isBoolean = is.isBoolean,
            bind = fn.bind,
            bindIgnore = fn.bindIgnore,
            argsToArray = args.argsToArray;

        function createHandler(fn, promise) {
            return function _handler() {
                try {
                    when(fn.apply(null, arguments))
                        .addCallback(promise)
                        .addErrback(promise);
                } catch (e) {
                    promise.errback(e);
                }
            };
        }

        var nextTick;
        if (typeof setImmediate === "function") {
            // In IE10, or use https://github.com/NobleJS/setImmediate
            if (typeof window !== "undefined") {
                nextTick = setImmediate.bind(window);
            } else {
                nextTick = setImmediate;
            }
        } else if (typeof process !== "undefined") {
            // node
            nextTick = function (cb) {
                process.nextTick(cb);
            };
        } else if (typeof MessageChannel !== "undefined") {
            // modern browsers
            // http://www.nonblocking.io/2011/06/windownexttick.html
            var channel = new MessageChannel();
            // linked list of tasks (single, with head node)
            var head = {}, tail = head;
            channel.port1.onmessage = function () {
                head = head.next;
                var task = head.task;
                delete head.task;
                task();
            };
            nextTick = function (task) {
                tail = tail.next = {task: task};
                channel.port2.postMessage(0);
            };
        } else {
            // old browsers
            nextTick = function (task) {
                setTimeout(task, 0);
            };
        }


        //noinspection JSHint
        var Promise = declare({
            instance: {
                __fired: false,

                __results: null,

                __error: null,

                __errorCbs: null,

                __cbs: null,

                constructor: function () {
                    this.__errorCbs = [];
                    this.__cbs = [];
                    fn.bindAll(this, ["callback", "errback", "resolve", "classic", "__resolve", "addCallback", "addErrback"]);
                },

                __resolve: function () {
                    if (!this.__fired) {
                        this.__fired = true;
                        var cbs = this.__error ? this.__errorCbs : this.__cbs,
                            len = cbs.length, i,
                            results = this.__error || this.__results;
                        for (i = 0; i < len; i++) {
                            this.__callNextTick(cbs[i], results);
                        }

                    }
                },

                __callNextTick: function (cb, results) {
                    nextTick(function () {
                        cb.apply(this, results);
                    });
                },

                addCallback: function (cb) {
                    if (cb) {
                        if (isPromiseLike(cb) && cb.callback) {
                            cb = cb.callback;
                        }
                        if (this.__fired && this.__results) {
                            this.__callNextTick(cb, this.__results);
                        } else {
                            this.__cbs.push(cb);
                        }
                    }
                    return this;
                },


                addErrback: function (cb) {
                    if (cb) {
                        if (isPromiseLike(cb) && cb.errback) {
                            cb = cb.errback;
                        }
                        if (this.__fired && this.__error) {
                            this.__callNextTick(cb, this.__error);
                        } else {
                            this.__errorCbs.push(cb);
                        }
                    }
                    return this;
                },

                callback: function (args) {
                    if (!this.__fired) {
                        this.__results = arguments;
                        this.__resolve();
                    }
                    return this.promise();
                },

                errback: function (args) {
                    if (!this.__fired) {
                        this.__error = arguments;
                        this.__resolve();
                    }
                    return this.promise();
                },

                resolve: function (err, args) {
                    if (err) {
                        this.errback(err);
                    } else {
                        this.callback.apply(this, argsToArray(arguments, 1));
                    }
                    return this;
                },

                classic: function (cb) {
                    if ("function" === typeof cb) {
                        this.addErrback(function (err) {
                            cb(err);
                        });
                        this.addCallback(function () {
                            cb.apply(this, [null].concat(argsToArray(arguments)));
                        });
                    }
                    return this;
                },

                then: function (callback, errback) {

                    var promise = new Promise(), errorHandler = promise;
                    if (isFunction(errback)) {
                        errorHandler = createHandler(errback, promise);
                    }
                    this.addErrback(errorHandler);
                    if (isFunction(callback)) {
                        this.addCallback(createHandler(callback, promise));
                    } else {
                        this.addCallback(promise);
                    }

                    return promise.promise();
                },

                both: function (callback) {
                    return this.then(callback, callback);
                },

                promise: function () {
                    var ret = {
                        then: bind(this, "then"),
                        both: bind(this, "both"),
                        promise: function () {
                            return ret;
                        }
                    };
                    forEach(["addCallback", "addErrback", "classic"], function (action) {
                        ret[action] = bind(this, function () {
                            this[action].apply(this, arguments);
                            return ret;
                        });
                    }, this);

                    return ret;
                }


            }
        });


        var PromiseList = Promise.extend({
            instance: {

                /*@private*/
                __results: null,

                /*@private*/
                __errors: null,

                /*@private*/
                __promiseLength: 0,

                /*@private*/
                __defLength: 0,

                /*@private*/
                __firedLength: 0,

                normalizeResults: false,

                constructor: function (defs, normalizeResults) {
                    this.__errors = [];
                    this.__results = [];
                    this.normalizeResults = isBoolean(normalizeResults) ? normalizeResults : false;
                    this._super(arguments);
                    if (defs && defs.length) {
                        this.__defLength = defs.length;
                        forEach(defs, this.__addPromise, this);
                    } else {
                        this.__resolve();
                    }
                },

                __addPromise: function (promise, i) {
                    promise.then(
                        bind(this, function () {
                            var args = argsToArray(arguments);
                            args.unshift(i);
                            this.callback.apply(this, args);
                        }),
                        bind(this, function () {
                            var args = argsToArray(arguments);
                            args.unshift(i);
                            this.errback.apply(this, args);
                        })
                    );
                },

                __resolve: function () {
                    if (!this.__fired) {
                        this.__fired = true;
                        var cbs = this.__errors.length ? this.__errorCbs : this.__cbs,
                            len = cbs.length, i,
                            results = this.__errors.length ? this.__errors : this.__results;
                        for (i = 0; i < len; i++) {
                            this.__callNextTick(cbs[i], results);
                        }

                    }
                },

                __callNextTick: function (cb, results) {
                    nextTick(function () {
                        cb.apply(null, [results]);
                    });
                },

                addCallback: function (cb) {
                    if (cb) {
                        if (isPromiseLike(cb) && cb.callback) {
                            cb = bind(cb, "callback");
                        }
                        if (this.__fired && !this.__errors.length) {
                            this.__callNextTick(cb, this.__results);
                        } else {
                            this.__cbs.push(cb);
                        }
                    }
                    return this;
                },

                addErrback: function (cb) {
                    if (cb) {
                        if (isPromiseLike(cb) && cb.errback) {
                            cb = bind(cb, "errback");
                        }
                        if (this.__fired && this.__errors.length) {
                            this.__callNextTick(cb, this.__errors);
                        } else {
                            this.__errorCbs.push(cb);
                        }
                    }
                    return this;
                },


                callback: function (i) {
                    if (this.__fired) {
                        throw new Error("Already fired!");
                    }
                    var args = argsToArray(arguments);
                    if (this.normalizeResults) {
                        args = args.slice(1);
                        args = args.length === 1 ? args.pop() : args;
                    }
                    this.__results[i] = args;
                    this.__firedLength++;
                    if (this.__firedLength === this.__defLength) {
                        this.__resolve();
                    }
                    return this.promise();
                },


                errback: function (i) {
                    if (this.__fired) {
                        throw new Error("Already fired!");
                    }
                    var args = argsToArray(arguments);
                    if (this.normalizeResults) {
                        args = args.slice(1);
                        args = args.length === 1 ? args.pop() : args;
                    }
                    this.__errors[i] = args;
                    this.__firedLength++;
                    if (this.__firedLength === this.__defLength) {
                        this.__resolve();
                    }
                    return this.promise();
                }

            }
        });


        function callNext(list, results, propogate) {
            var ret = new Promise().callback();
            forEach(list, function (listItem) {
                ret = ret.then(propogate ? listItem : bindIgnore(null, listItem));
                if (!propogate) {
                    ret = ret.then(function (res) {
                        results.push(res);
                        return results;
                    });
                }
            });
            return ret;
        }

        function isPromiseLike(obj) {
            return !isUndefinedOrNull(obj) && (isFunction(obj.then));
        }

        function wrapThenPromise(p) {
            var ret = new Promise();
            p.then(bind(ret, "callback"), bind(ret, "errback"));
            return  ret.promise();
        }

        function when(args) {
            var p;
            args = argsToArray(arguments);
            if (!args.length) {
                p = new Promise().callback(args).promise();
            } else if (args.length === 1) {
                args = args.pop();
                if (isPromiseLike(args)) {
                    if (args.addCallback && args.addErrback) {
                        p = new Promise();
                        args.addCallback(p.callback);
                        args.addErrback(p.errback);
                    } else {
                        p = wrapThenPromise(args);
                    }
                } else if (isArray(args) && array.every(args, isPromiseLike)) {
                    p = new PromiseList(args, true).promise();
                } else {
                    p = new Promise().callback(args);
                }
            } else {
                p = new PromiseList(array.map(args, function (a) {
                    return when(a);
                }), true).promise();
            }
            return p;

        }

        function wrap(fn, scope) {
            return function _wrap() {
                var ret = new Promise();
                var args = argsToArray(arguments);
                args.push(ret.resolve);
                fn.apply(scope || this, args);
                return ret.promise();
            };
        }

        function serial(list) {
            if (isArray(list)) {
                return callNext(list, [], false);
            } else {
                throw new Error("When calling promise.serial the first argument must be an array");
            }
        }


        function chain(list) {
            if (isArray(list)) {
                return callNext(list, [], true);
            } else {
                throw new Error("When calling promise.serial the first argument must be an array");
            }
        }


        function wait(args, fn) {
            args = argsToArray(arguments);
            var resolved = false;
            fn = args.pop();
            var p = when(args);
            return function waiter() {
                if (!resolved) {
                    args = arguments;
                    return p.then(bind(this, function doneWaiting() {
                        resolved = true;
                        return fn.apply(this, args);
                    }));
                } else {
                    return when(fn.apply(this, arguments));
                }
            };
        }

        function createPromise() {
            return new Promise();
        }

        function createPromiseList(promises) {
            return new PromiseList(promises, true).promise();
        }

        function createRejected(val) {
            return createPromise().errback(val);
        }

        function createResolved(val) {
            return createPromise().callback(val);
        }


        return extended
            .define({
                isPromiseLike: isPromiseLike
            }).expose({
                isPromiseLike: isPromiseLike,
                when: when,
                wrap: wrap,
                wait: wait,
                serial: serial,
                chain: chain,
                Promise: Promise,
                PromiseList: PromiseList,
                promise: createPromise,
                defer: createPromise,
                deferredList: createPromiseList,
                reject: createRejected,
                resolve: createResolved
            });

    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = definePromise(require("declare.js"), require("extended"), require("array-extended"), require("is-extended"), require("function-extended"), require("arguments-extended"));
        }
    } else if ("function" === typeof define && define.amd) {
        define(["declare", "extended", "array-extended", "is-extended", "function-extended", "arguments-extended"], function (declare, extended, array, is, fn, args) {
            return definePromise(declare, extended, array, is, fn, args);
        });
    } else {
        this.promiseExtended = definePromise(this.declare, this.extended, this.arrayExtended, this.isExtended, this.functionExtended, this.argumentsExtended);
    }

}).call(this);







},{"__browserify_process":64,"arguments-extended":51,"array-extended":52,"declare.js":55,"extended":56,"function-extended":59,"is-extended":66}],70:[function(require,module,exports){
(function () {
    "use strict";

    function defineString(extended, is, date, arr) {

        var stringify;
        if (typeof JSON === "undefined") {
            /*
             json2.js
             2012-10-08

             Public Domain.

             NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
             */

            (function () {
                function f(n) {
                    // Format integers to have at least two digits.
                    return n < 10 ? '0' + n : n;
                }

                var isPrimitive = is.tester().isString().isNumber().isBoolean().tester();

                function toJSON(obj) {
                    if (is.isDate(obj)) {
                        return isFinite(obj.valueOf()) ? obj.getUTCFullYear() + '-' +
                            f(obj.getUTCMonth() + 1) + '-' +
                            f(obj.getUTCDate()) + 'T' +
                            f(obj.getUTCHours()) + ':' +
                            f(obj.getUTCMinutes()) + ':' +
                            f(obj.getUTCSeconds()) + 'Z'
                            : null;
                    } else if (isPrimitive(obj)) {
                        return obj.valueOf();
                    }
                    return obj;
                }

                var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    gap,
                    indent,
                    meta = {    // table of character substitutions
                        '\b': '\\b',
                        '\t': '\\t',
                        '\n': '\\n',
                        '\f': '\\f',
                        '\r': '\\r',
                        '"': '\\"',
                        '\\': '\\\\'
                    },
                    rep;


                function quote(string) {
                    escapable.lastIndex = 0;
                    return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
                        var c = meta[a];
                        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    }) + '"' : '"' + string + '"';
                }


                function str(key, holder) {

                    var i, k, v, length, mind = gap, partial, value = holder[key];
                    if (value) {
                        value = toJSON(value);
                    }
                    if (typeof rep === 'function') {
                        value = rep.call(holder, key, value);
                    }
                    switch (typeof value) {
                    case 'string':
                        return quote(value);
                    case 'number':
                        return isFinite(value) ? String(value) : 'null';
                    case 'boolean':
                    case 'null':
                        return String(value);
                    case 'object':
                        if (!value) {
                            return 'null';
                        }
                        gap += indent;
                        partial = [];
                        if (Object.prototype.toString.apply(value) === '[object Array]') {
                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || 'null';
                            }
                            v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                            gap = mind;
                            return v;
                        }
                        if (rep && typeof rep === 'object') {
                            length = rep.length;
                            for (i = 0; i < length; i += 1) {
                                if (typeof rep[i] === 'string') {
                                    k = rep[i];
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        } else {
                            for (k in value) {
                                if (Object.prototype.hasOwnProperty.call(value, k)) {
                                    v = str(k, value);
                                    if (v) {
                                        partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                    }
                                }
                            }
                        }
                        v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                        gap = mind;
                        return v;
                    }
                }

                stringify = function (value, replacer, space) {
                    var i;
                    gap = '';
                    indent = '';
                    if (typeof space === 'number') {
                        for (i = 0; i < space; i += 1) {
                            indent += ' ';
                        }
                    } else if (typeof space === 'string') {
                        indent = space;
                    }
                    rep = replacer;
                    if (replacer && typeof replacer !== 'function' &&
                        (typeof replacer !== 'object' ||
                            typeof replacer.length !== 'number')) {
                        throw new Error('JSON.stringify');
                    }
                    return str('', {'': value});
                };
            }());
        } else {
            stringify = JSON.stringify;
        }


        var isHash = is.isHash, aSlice = Array.prototype.slice;

        var FORMAT_REGEX = /%((?:-?\+?.?\d*)?|(?:\[[^\[|\]]*\]))?([sjdDZ])/g;
        var INTERP_REGEX = /\{(?:\[([^\[|\]]*)\])?(\w+)\}/g;
        var STR_FORMAT = /(-?)(\+?)([A-Z|a-z|\W]?)([1-9][0-9]*)?$/;
        var OBJECT_FORMAT = /([1-9][0-9]*)$/g;

        function formatString(string, format) {
            var ret = string;
            if (STR_FORMAT.test(format)) {
                var match = format.match(STR_FORMAT);
                var isLeftJustified = match[1], padChar = match[3], width = match[4];
                if (width) {
                    width = parseInt(width, 10);
                    if (ret.length < width) {
                        ret = pad(ret, width, padChar, isLeftJustified);
                    } else {
                        ret = truncate(ret, width);
                    }
                }
            }
            return ret;
        }

        function formatNumber(number, format) {
            var ret;
            if (is.isNumber(number)) {
                ret = "" + number;
                if (STR_FORMAT.test(format)) {
                    var match = format.match(STR_FORMAT);
                    var isLeftJustified = match[1], signed = match[2], padChar = match[3], width = match[4];
                    if (signed) {
                        ret = (number > 0 ? "+" : "") + ret;
                    }
                    if (width) {
                        width = parseInt(width, 10);
                        if (ret.length < width) {
                            ret = pad(ret, width, padChar || "0", isLeftJustified);
                        } else {
                            ret = truncate(ret, width);
                        }
                    }

                }
            } else {
                throw new Error("stringExtended.format : when using %d the parameter must be a number!");
            }
            return ret;
        }

        function formatObject(object, format) {
            var ret, match = format.match(OBJECT_FORMAT), spacing = 0;
            if (match) {
                spacing = parseInt(match[0], 10);
                if (isNaN(spacing)) {
                    spacing = 0;
                }
            }
            try {
                ret = stringify(object, null, spacing);
            } catch (e) {
                throw new Error("stringExtended.format : Unable to parse json from ", object);
            }
            return ret;
        }


        var styles = {
            //styles
            bold: 1,
            bright: 1,
            italic: 3,
            underline: 4,
            blink: 5,
            inverse: 7,
            crossedOut: 9,

            red: 31,
            green: 32,
            yellow: 33,
            blue: 34,
            magenta: 35,
            cyan: 36,
            white: 37,

            redBackground: 41,
            greenBackground: 42,
            yellowBackground: 43,
            blueBackground: 44,
            magentaBackground: 45,
            cyanBackground: 46,
            whiteBackground: 47,

            encircled: 52,
            overlined: 53,
            grey: 90,
            black: 90
        };

        var characters = {
            SMILEY: "☺",
            SOLID_SMILEY: "☻",
            HEART: "♥",
            DIAMOND: "♦",
            CLOVE: "♣",
            SPADE: "♠",
            DOT: "•",
            SQUARE_CIRCLE: "◘",
            CIRCLE: "○",
            FILLED_SQUARE_CIRCLE: "◙",
            MALE: "♂",
            FEMALE: "♀",
            EIGHT_NOTE: "♪",
            DOUBLE_EIGHTH_NOTE: "♫",
            SUN: "☼",
            PLAY: "►",
            REWIND: "◄",
            UP_DOWN: "↕",
            PILCROW: "¶",
            SECTION: "§",
            THICK_MINUS: "▬",
            SMALL_UP_DOWN: "↨",
            UP_ARROW: "↑",
            DOWN_ARROW: "↓",
            RIGHT_ARROW: "→",
            LEFT_ARROW: "←",
            RIGHT_ANGLE: "∟",
            LEFT_RIGHT_ARROW: "↔",
            TRIANGLE: "▲",
            DOWN_TRIANGLE: "▼",
            HOUSE: "⌂",
            C_CEDILLA: "Ç",
            U_UMLAUT: "ü",
            E_ACCENT: "é",
            A_LOWER_CIRCUMFLEX: "â",
            A_LOWER_UMLAUT: "ä",
            A_LOWER_GRAVE_ACCENT: "à",
            A_LOWER_CIRCLE_OVER: "å",
            C_LOWER_CIRCUMFLEX: "ç",
            E_LOWER_CIRCUMFLEX: "ê",
            E_LOWER_UMLAUT: "ë",
            E_LOWER_GRAVE_ACCENT: "è",
            I_LOWER_UMLAUT: "ï",
            I_LOWER_CIRCUMFLEX: "î",
            I_LOWER_GRAVE_ACCENT: "ì",
            A_UPPER_UMLAUT: "Ä",
            A_UPPER_CIRCLE: "Å",
            E_UPPER_ACCENT: "É",
            A_E_LOWER: "æ",
            A_E_UPPER: "Æ",
            O_LOWER_CIRCUMFLEX: "ô",
            O_LOWER_UMLAUT: "ö",
            O_LOWER_GRAVE_ACCENT: "ò",
            U_LOWER_CIRCUMFLEX: "û",
            U_LOWER_GRAVE_ACCENT: "ù",
            Y_LOWER_UMLAUT: "ÿ",
            O_UPPER_UMLAUT: "Ö",
            U_UPPER_UMLAUT: "Ü",
            CENTS: "¢",
            POUND: "£",
            YEN: "¥",
            CURRENCY: "¤",
            PTS: "₧",
            FUNCTION: "ƒ",
            A_LOWER_ACCENT: "á",
            I_LOWER_ACCENT: "í",
            O_LOWER_ACCENT: "ó",
            U_LOWER_ACCENT: "ú",
            N_LOWER_TILDE: "ñ",
            N_UPPER_TILDE: "Ñ",
            A_SUPER: "ª",
            O_SUPER: "º",
            UPSIDEDOWN_QUESTION: "¿",
            SIDEWAYS_L: "⌐",
            NEGATION: "¬",
            ONE_HALF: "½",
            ONE_FOURTH: "¼",
            UPSIDEDOWN_EXCLAMATION: "¡",
            DOUBLE_LEFT: "«",
            DOUBLE_RIGHT: "»",
            LIGHT_SHADED_BOX: "░",
            MEDIUM_SHADED_BOX: "▒",
            DARK_SHADED_BOX: "▓",
            VERTICAL_LINE: "│",
            MAZE__SINGLE_RIGHT_T: "┤",
            MAZE_SINGLE_RIGHT_TOP: "┐",
            MAZE_SINGLE_RIGHT_BOTTOM_SMALL: "┘",
            MAZE_SINGLE_LEFT_TOP_SMALL: "┌",
            MAZE_SINGLE_LEFT_BOTTOM_SMALL: "└",
            MAZE_SINGLE_LEFT_T: "├",
            MAZE_SINGLE_BOTTOM_T: "┴",
            MAZE_SINGLE_TOP_T: "┬",
            MAZE_SINGLE_CENTER: "┼",
            MAZE_SINGLE_HORIZONTAL_LINE: "─",
            MAZE_SINGLE_RIGHT_DOUBLECENTER_T: "╡",
            MAZE_SINGLE_RIGHT_DOUBLE_BL: "╛",
            MAZE_SINGLE_RIGHT_DOUBLE_T: "╢",
            MAZE_SINGLE_RIGHT_DOUBLEBOTTOM_TOP: "╖",
            MAZE_SINGLE_RIGHT_DOUBLELEFT_TOP: "╕",
            MAZE_SINGLE_LEFT_DOUBLE_T: "╞",
            MAZE_SINGLE_BOTTOM_DOUBLE_T: "╧",
            MAZE_SINGLE_TOP_DOUBLE_T: "╤",
            MAZE_SINGLE_TOP_DOUBLECENTER_T: "╥",
            MAZE_SINGLE_BOTTOM_DOUBLECENTER_T: "╨",
            MAZE_SINGLE_LEFT_DOUBLERIGHT_BOTTOM: "╘",
            MAZE_SINGLE_LEFT_DOUBLERIGHT_TOP: "╒",
            MAZE_SINGLE_LEFT_DOUBLEBOTTOM_TOP: "╓",
            MAZE_SINGLE_LEFT_DOUBLETOP_BOTTOM: "╙",
            MAZE_SINGLE_LEFT_TOP: "Γ",
            MAZE_SINGLE_RIGHT_BOTTOM: "╜",
            MAZE_SINGLE_LEFT_CENTER: "╟",
            MAZE_SINGLE_DOUBLECENTER_CENTER: "╫",
            MAZE_SINGLE_DOUBLECROSS_CENTER: "╪",
            MAZE_DOUBLE_LEFT_CENTER: "╣",
            MAZE_DOUBLE_VERTICAL: "║",
            MAZE_DOUBLE_RIGHT_TOP: "╗",
            MAZE_DOUBLE_RIGHT_BOTTOM: "╝",
            MAZE_DOUBLE_LEFT_BOTTOM: "╚",
            MAZE_DOUBLE_LEFT_TOP: "╔",
            MAZE_DOUBLE_BOTTOM_T: "╩",
            MAZE_DOUBLE_TOP_T: "╦",
            MAZE_DOUBLE_LEFT_T: "╠",
            MAZE_DOUBLE_HORIZONTAL: "═",
            MAZE_DOUBLE_CROSS: "╬",
            SOLID_RECTANGLE: "█",
            THICK_LEFT_VERTICAL: "▌",
            THICK_RIGHT_VERTICAL: "▐",
            SOLID_SMALL_RECTANGLE_BOTTOM: "▄",
            SOLID_SMALL_RECTANGLE_TOP: "▀",
            PHI_UPPER: "Φ",
            INFINITY: "∞",
            INTERSECTION: "∩",
            DEFINITION: "≡",
            PLUS_MINUS: "±",
            GT_EQ: "≥",
            LT_EQ: "≤",
            THEREFORE: "⌠",
            SINCE: "∵",
            DOESNOT_EXIST: "∄",
            EXISTS: "∃",
            FOR_ALL: "∀",
            EXCLUSIVE_OR: "⊕",
            BECAUSE: "⌡",
            DIVIDE: "÷",
            APPROX: "≈",
            DEGREE: "°",
            BOLD_DOT: "∙",
            DOT_SMALL: "·",
            CHECK: "√",
            ITALIC_X: "✗",
            SUPER_N: "ⁿ",
            SQUARED: "²",
            CUBED: "³",
            SOLID_BOX: "■",
            PERMILE: "‰",
            REGISTERED_TM: "®",
            COPYRIGHT: "©",
            TRADEMARK: "™",
            BETA: "β",
            GAMMA: "γ",
            ZETA: "ζ",
            ETA: "η",
            IOTA: "ι",
            KAPPA: "κ",
            LAMBDA: "λ",
            NU: "ν",
            XI: "ξ",
            OMICRON: "ο",
            RHO: "ρ",
            UPSILON: "υ",
            CHI_LOWER: "φ",
            CHI_UPPER: "χ",
            PSI: "ψ",
            ALPHA: "α",
            ESZETT: "ß",
            PI: "π",
            SIGMA_UPPER: "Σ",
            SIGMA_LOWER: "σ",
            MU: "µ",
            TAU: "τ",
            THETA: "Θ",
            OMEGA: "Ω",
            DELTA: "δ",
            PHI_LOWER: "φ",
            EPSILON: "ε"
        };

        function pad(string, length, ch, end) {
            string = "" + string; //check for numbers
            ch = ch || " ";
            var strLen = string.length;
            while (strLen < length) {
                if (end) {
                    string += ch;
                } else {
                    string = ch + string;
                }
                strLen++;
            }
            return string;
        }

        function truncate(string, length, end) {
            var ret = string;
            if (is.isString(ret)) {
                if (string.length > length) {
                    if (end) {
                        var l = string.length;
                        ret = string.substring(l - length, l);
                    } else {
                        ret = string.substring(0, length);
                    }
                }
            } else {
                ret = truncate("" + ret, length);
            }
            return ret;
        }

        function format(str, obj) {
            if (obj instanceof Array) {
                var i = 0, len = obj.length;
                //find the matches
                return str.replace(FORMAT_REGEX, function (m, format, type) {
                    var replacer, ret;
                    if (i < len) {
                        replacer = obj[i++];
                    } else {
                        //we are out of things to replace with so
                        //just return the match?
                        return m;
                    }
                    if (m === "%s" || m === "%d" || m === "%D") {
                        //fast path!
                        ret = replacer + "";
                    } else if (m === "%Z") {
                        ret = replacer.toUTCString();
                    } else if (m === "%j") {
                        try {
                            ret = stringify(replacer);
                        } catch (e) {
                            throw new Error("stringExtended.format : Unable to parse json from ", replacer);
                        }
                    } else {
                        format = format.replace(/^\[|\]$/g, "");
                        switch (type) {
                        case "s":
                            ret = formatString(replacer, format);
                            break;
                        case "d":
                            ret = formatNumber(replacer, format);
                            break;
                        case "j":
                            ret = formatObject(replacer, format);
                            break;
                        case "D":
                            ret = date.format(replacer, format);
                            break;
                        case "Z":
                            ret = date.format(replacer, format, true);
                            break;
                        }
                    }
                    return ret;
                });
            } else if (isHash(obj)) {
                return str.replace(INTERP_REGEX, function (m, format, value) {
                    value = obj[value];
                    if (!is.isUndefined(value)) {
                        if (format) {
                            if (is.isString(value)) {
                                return formatString(value, format);
                            } else if (is.isNumber(value)) {
                                return formatNumber(value, format);
                            } else if (is.isDate(value)) {
                                return date.format(value, format);
                            } else if (is.isObject(value)) {
                                return formatObject(value, format);
                            }
                        } else {
                            return "" + value;
                        }
                    }
                    return m;
                });
            } else {
                var args = aSlice.call(arguments).slice(1);
                return format(str, args);
            }
        }

        function toArray(testStr, delim) {
            var ret = [];
            if (testStr) {
                if (testStr.indexOf(delim) > 0) {
                    ret = testStr.replace(/\s+/g, "").split(delim);
                }
                else {
                    ret.push(testStr);
                }
            }
            return ret;
        }

        function multiply(str, times) {
            var ret = [];
            if (times) {
                for (var i = 0; i < times; i++) {
                    ret.push(str);
                }
            }
            return ret.join("");
        }


        function style(str, options) {
            var ret, i, l;
            if (options) {
                if (is.isArray(str)) {
                    ret = [];
                    for (i = 0, l = str.length; i < l; i++) {
                        ret.push(style(str[i], options));
                    }
                } else if (options instanceof Array) {
                    ret = str;
                    for (i = 0, l = options.length; i < l; i++) {
                        ret = style(ret, options[i]);
                    }
                } else if (options in styles) {
                    ret = '\x1B[' + styles[options] + 'm' + str + '\x1B[0m';
                }
            }
            return ret;
        }

        function escape(str, except) {
            return str.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, function (ch) {
                if (except && arr.indexOf(except, ch) !== -1) {
                    return ch;
                }
                return "\\" + ch;
            });
        }

        function trim(str) {
            return str.replace(/^\s*|\s*$/g, "");
        }

        function trimLeft(str) {
            return str.replace(/^\s*/, "");
        }

        function trimRight(str) {
            return str.replace(/\s*$/, "");
        }

        function isEmpty(str) {
            return str.length === 0;
        }


        var string = {
            toArray: toArray,
            pad: pad,
            truncate: truncate,
            multiply: multiply,
            format: format,
            style: style,
            escape: escape,
            trim: trim,
            trimLeft: trimLeft,
            trimRight: trimRight,
            isEmpty: isEmpty
        };
        return extended.define(is.isString, string).define(is.isArray, {style: style}).expose(string).expose({characters: characters});
    }

    if ("undefined" !== typeof exports) {
        if ("undefined" !== typeof module && module.exports) {
            module.exports = defineString(require("extended"), require("is-extended"), require("date-extended"), require("array-extended"));

        }
    } else if ("function" === typeof define && define.amd) {
        define(["extended", "is-extended", "date-extended", "array-extended"], function (extended, is, date, arr) {
            return defineString(extended, is, date, arr);
        });
    } else {
        this.stringExtended = defineString(this.extended, this.isExtended, this.dateExtended, this.arrayExtended);
    }

}).call(this);







},{"array-extended":52,"date-extended":53,"extended":56,"is-extended":66}]},{},[1])
;