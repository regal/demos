/** 
* regal-demo-snippets
* by Joe Cowman <joe.r.cowman@gmail.com> (http://joecowman.com)
*
* Powered by the Regal Framework (https://github.com/regal/regal).
*/
'use strict';

var Prando = /** @class */ (function () {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    /**
     * Generate a new Prando pseudo-random number generator.
     *
     * @param seed - A number or string seed that determines which pseudo-random number sequence will be created. Defaults to current time.
     */
    function Prando(seed) {
        this._value = NaN;
        if (typeof (seed) === "string") {
            // String seed
            this._seed = this.hashCode(seed);
        }
        else if (typeof (seed) === "number") {
            // Numeric seed
            this._seed = this.getSafeSeed(seed);
        }
        else {
            // Pseudo-random seed
            this._seed = this.getSafeSeed(Prando.MIN + Math.floor((Prando.MAX - Prando.MIN) * Math.random()));
        }
        this.reset();
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    /**
     * Generates a pseudo-random number between a lower (inclusive) and a higher (exclusive) bounds.
     *
     * @param min - The minimum number that can be randomly generated.
     * @param pseudoMax - The maximum number that can be randomly generated (exclusive).
     * @return The generated pseudo-random number.
     */
    Prando.prototype.next = function (min, pseudoMax) {
        if (min === void 0) { min = 0; }
        if (pseudoMax === void 0) { pseudoMax = 1; }
        this.recalculate();
        return this.map(this._value, Prando.MIN, Prando.MAX, min, pseudoMax);
    };
    /**
     * Generates a pseudo-random integer number in a range (inclusive).
     *
     * @param min - The minimum number that can be randomly generated.
     * @param max - The maximum number that can be randomly generated.
     * @return The generated pseudo-random number.
     */
    Prando.prototype.nextInt = function (min, max) {
        if (min === void 0) { min = 10; }
        if (max === void 0) { max = 100; }
        this.recalculate();
        return Math.floor(this.map(this._value, Prando.MIN, Prando.MAX, min, max + 1));
    };
    /**
     * Generates a pseudo-random string sequence of a particular length from a specific character range.
     *
     * Note: keep in mind that creating a random string sequence does not guarantee uniqueness; there is always a
     * 1 in (char_length^string_length) chance of collision. For real unique string ids, always check for
     * pre-existing ids, or employ a robust GUID/UUID generator.
     *
     * @param length - Length of the strting to be generated.
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated string sequence.
     */
    Prando.prototype.nextString = function (length, chars) {
        if (length === void 0) { length = 16; }
        if (chars === void 0) { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; }
        var str = "";
        while (str.length < length) {
            str += this.nextChar(chars);
        }
        return str;
    };
    /**
     * Generates a pseudo-random string of 1 character specific character range.
     *
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated character.
     */
    Prando.prototype.nextChar = function (chars) {
        if (chars === void 0) { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; }
        this.recalculate();
        return chars.substr(this.nextInt(0, chars.length - 1), 1);
    };
    /**
     * Picks a pseudo-random item from an array. The array is left unmodified.
     *
     * Note: keep in mind that while the returned item will be random enough, picking one item from the array at a time
     * does not guarantee nor imply that a sequence of random non-repeating items will be picked. If you want to
     * *pick items in a random order* from an array, instead of *pick one random item from an array*, it's best to
     * apply a *shuffle* transformation to the array instead, then read it linearly.
     *
     * @param array - Array of any type containing one or more candidates for random picking.
     * @return An item from the array.
     */
    Prando.prototype.nextArrayItem = function (array) {
        this.recalculate();
        return array[this.nextInt(0, array.length - 1)];
    };
    /**
     * Generates a pseudo-random boolean.
     *
     * @return A value of true or false.
     */
    Prando.prototype.nextBoolean = function () {
        this.recalculate();
        return this._value > 0.5;
    };
    /**
     * Skips ahead in the sequence of numbers that are being generated. This is equivalent to
     * calling next() a specified number of times, but faster since it doesn't need to map the
     * new random numbers to a range and return it.
     *
     * @param iterations - The number of items to skip ahead.
     */
    Prando.prototype.skip = function (iterations) {
        if (iterations === void 0) { iterations = 1; }
        while (iterations-- > 0) {
            this.recalculate();
        }
    };
    /**
     * Reset the pseudo-random number sequence back to its starting seed. Further calls to next()
     * will then produce the same sequence of numbers it had produced before. This is equivalent to
     * creating a new Prando instance with the same seed as another Prando instance.
     *
     * Example:
     * let rng = new Prando(12345678);
     * console.log(rng.next()); // 0.6177754114889017
     * console.log(rng.next()); // 0.5784605181725837
     * rng.reset();
     * console.log(rng.next()); // 0.6177754114889017 again
     * console.log(rng.next()); // 0.5784605181725837 again
     */
    Prando.prototype.reset = function () {
        this._value = this._seed;
    };
    // ================================================================================================================
    // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
    Prando.prototype.recalculate = function () {
        this._value = this.xorshift(this._value);
    };
    Prando.prototype.xorshift = function (value) {
        // Xorshift*32
        // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
        value ^= value << 13;
        value ^= value >> 17;
        value ^= value << 5;
        return value;
    };
    Prando.prototype.map = function (val, minFrom, maxFrom, minTo, maxTo) {
        return ((val - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;
    };
    Prando.prototype.hashCode = function (str) {
        var hash = 0;
        if (str) {
            var l = str.length;
            for (var i = 0; i < l; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
                hash = this.xorshift(hash);
            }
        }
        return this.getSafeSeed(hash);
    };
    Prando.prototype.getSafeSeed = function (seed) {
        if (seed === 0)
            return 1;
        return seed;
    };
    Prando.MIN = -2147483648; // Int32 min
    Prando.MAX = 2147483647; // Int32 max
    return Prando;
}());

/**
 * Source code for Regal (a.k.a. the Regal Game Library), part of the Regal Framework.
 * 
 * Copyright (c) 2018 Joseph R Cowman
 * Licensed under MIT License (see https://github.com/regal/regal)
 */

/**
 * Manages the game's context by keeping track of whether the
 * context is currently static or not.
 *
 * A game's context is static during the declaration period,
 * meaning when the source is run initially and static managers
 * (like the `StaticAgentRegistry`) are populated.
 *
 * A game's context is non-static as soon as it is initialized
 * by some command in the `Game` API. Every `GameInstance` exists
 * in a non-static context.
 */
class ContextManager {
    /** Whether the game's context is currently static. */
    static isContextStatic() {
        return this._contextIsStatic;
    }
    /** Resets the game's context to be static. */
    static reset() {
        this._contextIsStatic = true;
    }
    /** Sets the game's context to be non-static. */
    static init() {
        this._contextIsStatic = false;
    }
}
/** Internal variable to track whether the context is static. */
ContextManager._contextIsStatic = true;

/** Whether the given object is an `AgentArrayReference`. */
const isAgentArrayReference = (o) => o && o.arRefId !== undefined;
/**
 * Mock object that is used in place of references to active agent arrays.
 */
class AgentArrayReference {
    /**
     * Constructs a new `AgentReference` in place of an active agent array.
     * @param arRefId The agent array's numeric id.
     */
    constructor(arRefId) {
        this.arRefId = arRefId;
    }
}

/** Whether the given object is an `AgentReference`. */
const isAgentReference = (o) => o && o.refId !== undefined;
/**
 * Mock object that is used in place of active agent circular references.
 */
class AgentReference {
    /**
     * Constructs a new `AgentReference` in place of an active agent.
     * @param refId The mocked agent's numeric id.
     */
    constructor(refId) {
        this.refId = refId;
    }
}

/**
 * Default values for every game option.
 * If any option is not overridden by the developer, its corresponding
 * value in this object will be used.
 */
const DEFAULT_GAME_OPTIONS = {
    allowOverrides: true,
    debug: false,
    seed: undefined,
    showMinor: true,
    trackAgentChanges: false
};
/** The names of every game option. */
const OPTION_KEYS = Object.keys(DEFAULT_GAME_OPTIONS);

/**
 * Error thrown during execution of Regal library functions.
 */
class RegalError extends Error {
    /**
     * Constructs a `RegalError` with the given message.
     * @param message The error message, which will be prepended with "RegalError: ".
     */
    constructor(message) {
        super(`RegalError: ${message}`);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Contains all letters (upper- and lower-case), numbers, and some special characters.
 * Used for pseudo-random string generation.
 */
const EXPANDED_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()-_=+{}[]|;:<>,.?";
/**
 * Contains all letters (upper- and lower-case) and numbers.
 * Used for pseudo-random string generation.
 */
const ALHPANUMERIC_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
/**
 * Contains all letters (upper- and lower-case).
 * Used for pseudo-random string generation.
 */
const ALPHABET_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
/**
 * Contains all numbers.
 * Used for pseudo-random string generation.
 */
const NUMBERS_CHARSET = "0123456789";

var charsets = /*#__PURE__*/Object.freeze({
    EXPANDED_CHARSET: EXPANDED_CHARSET,
    ALHPANUMERIC_CHARSET: ALHPANUMERIC_CHARSET,
    ALPHABET_CHARSET: ALPHABET_CHARSET,
    NUMBERS_CHARSET: NUMBERS_CHARSET
});

/**
 * Constructs an `InstanceRandom` using the current implementation.
 * @param game The managing `GameInstance`.
 * @param numGenerations The number of generations to start from.
 * Defaults to zero.
 */
const buildInstanceRandom = (game, numGenerations = 0) => new InstanceRandomImpl(game, numGenerations);
class InstanceRandomImpl {
    constructor(game, numGenerations) {
        this.game = game;
        if (this.seed === undefined) {
            throw new RegalError("Seed must be defined before an InstanceRandom can be constructed.");
        }
        this._numGenerations = numGenerations;
        this._generator = new Prando(this.seed);
        this._generator.skip(numGenerations);
    }
    get seed() {
        return this.game.options.seed;
    }
    get numGenerations() {
        return this._numGenerations;
    }
    recycle(newInstance) {
        return new InstanceRandomImpl(newInstance, this.numGenerations);
    }
    int(min, max) {
        if (min > max) {
            throw new RegalError(`Min <${min}> must be less than or equal to max <${max}>.`);
        }
        const value = this._generator.nextInt(min, max);
        this.trackRandom(value);
        this._numGenerations++;
        return value;
    }
    decimal() {
        const value = this._generator.next(0, 1);
        this.trackRandom(value);
        this._numGenerations++;
        return value;
    }
    string(length, charset = EXPANDED_CHARSET) {
        if (length <= 0) {
            throw new RegalError(`Length <${length}> must be greater than zero.`);
        }
        if (new Set(charset).size < 2) {
            throw new RegalError(`Charset <${charset}> must have at least two unique characters.`);
        }
        const value = this._generator.nextString(length, charset);
        this.trackRandom(value);
        this._numGenerations++;
        return value;
    }
    choice(array) {
        if (array === undefined) {
            throw new RegalError("Array must be defined.");
        }
        const idx = this._generator.nextInt(0, array.length - 1);
        this.trackRandom(idx); // Track the index of the selected element, rather than the element itself
        this._numGenerations++;
        return array[idx];
    }
    boolean() {
        const value = this._generator.nextBoolean();
        this.trackRandom(value);
        this._numGenerations++;
        return value;
    }
    /** Internal helper method to add the `RandomRecord` to the current `EventRecord`. */
    trackRandom(value) {
        this.game.events.current.trackRandom({
            id: this.numGenerations,
            value
        });
    }
}

// Note: the following configuration results in 89^10 possible seeds
/** Default length of seeds generated by `InstanceOptions` when none is specified. */
const SEED_LENGTH = 10;
/** Default charset used to generate seeds within `InstanceOptions` when none is specified. */
const DEFAULT_SEED_CHARSET = EXPANDED_CHARSET;
/**
 * Generates a pseudo-random seed to use in further pseudo-random data generation.
 */
const generateSeed = () => new Prando().nextString(SEED_LENGTH, DEFAULT_SEED_CHARSET);

/**
 * Throws an error if the property of the object is not the given type.
 *
 * @param target The object with the property.
 * @param key The name of the property.
 * @param expectedType What the property's type should be.
 * @param allowUndefined Whether an error should be thrown if the property is undefined.
 * @param generalKeyName The general key name to use in error messages (i.e. "option", "key", or "prop").
 */
const checkPropertyType = (target, key, expectedType, allowUndefined, generalKeyName) => {
    const value = target[key];
    const actualType = typeof value;
    if (value !== undefined) {
        if (actualType !== expectedType) {
            throw new RegalError(`The ${generalKeyName} <${key}> is of type <${actualType}>, must be of type <${expectedType}>.`);
        }
    }
    else if (!allowUndefined) {
        throw new RegalError(`The ${generalKeyName} <${key}> must be defined.`);
    }
};
/**
 * Throws an error if any of the given options are invalid.
 * @param options Any game options.
 */
const validateOptions = (options) => {
    // Ensure no extraneous options were included.
    Object.keys(options).forEach(key => {
        if (!OPTION_KEYS.includes(key)) {
            throw new RegalError(`Invalid option name <${key}>.`);
        }
    });
    const checkOptionType = (key, expectedType) => checkPropertyType(options, key, expectedType, true, "option");
    checkOptionType("debug", "boolean");
    // Validate allowOverrides
    if (options.allowOverrides !== undefined) {
        if (Array.isArray(options.allowOverrides)) {
            // Ensure every option name in the list is a real option.
            options.allowOverrides.forEach(optionName => {
                if (!OPTION_KEYS.includes(optionName)) {
                    throw new RegalError(`The option <${optionName}> does not exist.`);
                }
            });
            // Ensure that allowOverrides is not included in the list.
            if (options.allowOverrides.includes("allowOverrides")) {
                throw new RegalError("The option <allowOverrides> is not allowed to be overridden.");
            }
        }
        else if (typeof options.allowOverrides !== "boolean") {
            throw new RegalError(`The option <allowOverrides> is of type <${typeof options.allowOverrides}>, must be of type <boolean> or <string[]>.`);
        }
    }
    checkOptionType("showMinor", "boolean");
    checkOptionType("trackAgentChanges", "boolean");
    checkOptionType("seed", "string");
};
/**
 * Given a value of the `allowOverrides` option, throw an error if
 * the attempted option overrides aren't valid.
 *
 * @param overrides The attempted option overrides.
 * @param allowOverrides The `allowOverrides` value to validate against.
 */
const ensureOverridesAllowed = (overrides, allowOverrides) => {
    if (overrides.allowOverrides !== undefined) {
        throw new RegalError("The allowOverrides option can never be overridden.");
    }
    if (Array.isArray(allowOverrides)) {
        const overrideKeys = Object.keys(overrides);
        const forbiddenKeys = overrideKeys.filter(key => !allowOverrides.includes(key));
        if (forbiddenKeys.length > 0) {
            throw new RegalError(`The following option overrides are forbidden: <${forbiddenKeys}>.`);
        }
    }
    else {
        // Option is a boolean
        if (!allowOverrides && Object.keys(overrides).length > 0) {
            throw new RegalError("No option overrides are allowed.");
        }
    }
};

/** Prevents `InstanceOptions.overrides` from being modified. */
const OPTION_OVERRIDES_PROXY_HANDLER = {
    set() {
        throw new RegalError("Cannot modify the properties of the InstanceOption option overrides.");
    }
};
/** Prevents `InstanceOptions` from being modified. */
const INSTANCE_OPTIONS_PROXY_HANDLER = {
    get(target, propertyKey, receiver) {
        // If the option hasn't been overridden, get the default value.
        return target[propertyKey] === undefined
            ? DEFAULT_GAME_OPTIONS[propertyKey]
            : Reflect.get(target, propertyKey, receiver);
    },
    set() {
        throw new RegalError("Cannot modify the properties of InstanceOptions.");
    }
};
/**
 * Builds a new `InstanceOptions` based on the options specified
 * in the static configuration, allowing for option overrides (if valid).
 *
 * @param game The game instance that owns this `InstanceOptions`.
 * @param overrides Any option overrides preferred for this specific instance.
 * Must be allowed by the static configuration's `allowOverrides` option.
 * @param generatedSeed Include if the previous GameInstance had a default-generated seed
 */
const buildInstanceOptions = (game, overrides = {}, generatedSeed) => new InstanceOptionsImpl(game, overrides, generatedSeed);
class InstanceOptionsImpl {
    constructor(game, overrides, generatedSeed) {
        this.game = game;
        validateOptions(overrides);
        const configOpts = MetadataManager.getMetadata().options;
        validateOptions(configOpts);
        const allowOverrides = configOpts.allowOverrides !== undefined
            ? configOpts.allowOverrides
            : DEFAULT_GAME_OPTIONS.allowOverrides;
        ensureOverridesAllowed(overrides, allowOverrides);
        const overrideKeys = Object.keys(overrides);
        const configKeys = Object.keys(configOpts);
        configKeys
            .filter(key => !overrideKeys.includes(key))
            .forEach(key => (this[key] = configOpts[key]));
        overrideKeys.forEach(key => (this[key] = overrides[key]));
        // If passed a specified seed (as in generated by a previous GameInstance), use it.
        // Otherwise, generate a new one.
        if (this.seed === undefined) {
            this.seed =
                generatedSeed !== undefined ? generatedSeed : generateSeed();
        }
        this.overrides = new Proxy(overrides, OPTION_OVERRIDES_PROXY_HANDLER);
        return new Proxy(this, INSTANCE_OPTIONS_PROXY_HANDLER);
    }
}

var version = "0.7.1";

/** The names of every metadata property. */
const METADATA_KEYS = [
    "name",
    "author",
    "headline",
    "description",
    "homepage",
    "repository",
    "options",
    "regalVersion"
];

/** Safe copies an allowOverrides option. */
const copyAllowOverrides = (opt) => Array.isArray(opt) ? opt.map(str => str) : opt;
/** Safe copies a partial GameOptions object. */
const copyOptions = (opts) => {
    const copies = {}; // Writeable GameOptions
    if (opts.allowOverrides !== undefined) {
        copies.allowOverrides = copyAllowOverrides(opts.allowOverrides);
    }
    for (const opt of OPTION_KEYS.filter(key => key !== "allowOverrides")) {
        if (opts[opt] !== undefined) {
            copies[opt] = opts[opt];
        }
    }
    return copies;
};
/** Safe copies a metadata object. */
const copyMetadata = (md) => ({
    author: md.author,
    description: md.description,
    headline: md.headline,
    homepage: md.homepage,
    name: md.name,
    options: copyOptions(md.options),
    regalVersion: version,
    repository: md.repository
});
const optionalStringProps = [
    "headline",
    "description",
    "homepage",
    "repository"
];
/**
 * Throws an error if any of the given metadata properties are invalid.
 * This should be called before auto-generated properties, like regalVersion, are created.
 * @param md The metadata object.
 */
const validateMetadata = (md) => {
    Object.keys(md).forEach(key => {
        if (!METADATA_KEYS.includes(key)) {
            throw new RegalError(`Invalid metadata property <${key}>.`);
        }
    });
    const checkMdPropType = (key, expectedType, allowUndefined) => checkPropertyType(md, key, expectedType, allowUndefined, "metadata property");
    checkMdPropType("name", "string", false);
    checkMdPropType("author", "string", false);
    for (const prop of optionalStringProps) {
        checkMdPropType(prop, "string", true);
    }
    checkMdPropType("options", "object", false);
    validateOptions(md.options);
};

/**
 * Static manager for every game instance's metadata.
 */
class MetadataManager {
    /**
     * Returns the game's metadata, if it has been set.
     *
     * If it hasn't been set (i.e. the static configuration was never loaded),
     * an error will be thrown.
     */
    static getMetadata() {
        if (MetadataManager._metadata === undefined) {
            throw new RegalError("Metadata is not defined. Did you remember to load the config?");
        }
        return copyMetadata(this._metadata);
    }
    /**
     * Sets the static metadata for all instances of this game.
     * @param metadata The game's metadata.
     */
    static setMetadata(metadata) {
        if (metadata.regalVersion !== undefined) {
            throw new RegalError("regalVersion is specified internally and may not be modified.");
        }
        if (!metadata.hasOwnProperty("options")) {
            metadata.options = {};
        }
        validateMetadata(metadata);
        MetadataManager._metadata = copyMetadata(metadata);
    }
    /**
     * Clears the game's metadata.
     */
    static reset() {
        MetadataManager._metadata = undefined;
    }
}

/** Ensures the object is a `TrackedEvent`. */
const isTrackedEvent = (o) => o !== undefined && o.target !== undefined;
/** Ensures the object is an `EventQueue`. */
const isEventQueue = (o) => o !== undefined && o.immediateEvents !== undefined;
/**
 * "No operation" - reserved `TrackedEvent` that signals no more events.
 * Use only in rare cases where an event cannot return `void`.
 */
const noop = (() => {
    const nonEvent = (game) => undefined;
    const event = nonEvent;
    event.eventName = "noop";
    event.target = nonEvent;
    return event;
})();

/** Event ID for untracked `EventFunction`s. */
const DEFAULT_EVENT_ID = 0;
/** Name of untracked `EventFunction`s. */
const DEFAULT_EVENT_NAME = "DEFAULT";

/**
 * Builds a new `EventRecord`.
 *
 * @param id The event's unique numeric ID (optional).
 * @param name The event's name (optional).
 * @param func The event's `TrackedEvent`. Defaults to `noop`.
 */
const buildEventRecord = (id = DEFAULT_EVENT_ID, name = DEFAULT_EVENT_NAME, func = noop) => new EventRecordImpl(id, name, func);
class EventRecordImpl {
    constructor(id, name, func) {
        this.id = id;
        this.name = name;
        this.func = func;
    }
    trackOutputWrite(line) {
        if (this.output === undefined) {
            this.output = [];
        }
        this.output.push(line.id);
    }
    trackCausedEvent(...events) {
        if (this.caused === undefined) {
            this.caused = [];
        }
        this.caused.push(...events.map(e => e.id));
        events.forEach(e => (e.causedBy = this.id));
    }
    trackChange(propChange) {
        if (this.changes === undefined) {
            this.changes = [];
        }
        this.changes.push(propChange);
    }
    trackRandom(randRecord) {
        if (this.randoms === undefined) {
            this.randoms = [];
        }
        this.randoms.push(randRecord);
    }
}

/**
 * Builds an `InstanceEventsInternal`.
 * @param game The game instance that owns this `InstanceEventsInternal`.
 * @param startingEventId Optional starting ID for new `EventRecord`s.
 */
const buildInstanceEvents = (game, startingEventId) => startingEventId !== undefined
    ? new InstanceEventsImpl(game, startingEventId)
    : new InstanceEventsImpl(game);
class InstanceEventsImpl {
    constructor(game, startingEventId = DEFAULT_EVENT_ID) {
        this.game = game;
        this.history = [];
        /** Internal queue of events that have yet to be executed. */
        this._queue = [];
        this._lastEventId = startingEventId;
    }
    get current() {
        let event = this._queue[0];
        if (event === undefined) {
            event = buildEventRecord();
        }
        return event;
    }
    get lastEventId() {
        return this._lastEventId;
    }
    invoke(event) {
        this._addEvent(event);
        this._executeCurrent();
    }
    recycle(newInstance) {
        return new InstanceEventsImpl(newInstance, this.lastEventId);
    }
    /**
     * Adds the event to the internal queue. If the event is an `EventQueue`,
     * the event's `immediateEvents` are added to the front of the queue
     * and the `delayedEvents` are added to the back of the queue.
     *
     * @param event The `TrackedEvent` to be added to the queue.
     * @param cause The `EventRecord` to be recorded as the event's cause (optional).
     */
    _addEvent(event, cause) {
        let immediateEvents;
        let delayedEvents;
        if (isEventQueue(event)) {
            immediateEvents = event.immediateEvents;
            delayedEvents = event.delayedEvents;
        }
        else {
            immediateEvents = [event];
            delayedEvents = [];
        }
        const mapToRecord = (evObj) => buildEventRecord(++this._lastEventId, evObj.eventName, evObj);
        const immediateEventRecords = immediateEvents.map(mapToRecord);
        const delayedEventRecords = delayedEvents.map(mapToRecord);
        if (cause) {
            cause.trackCausedEvent(...immediateEventRecords);
            cause.trackCausedEvent(...delayedEventRecords);
        }
        this._queue = immediateEventRecords.concat(this._queue);
        this._queue = this._queue.concat(delayedEventRecords);
    }
    /**
     * Deletes unnecessary data from the current `EventRecord`
     * and moves it to the history array.
     */
    _archiveCurrent() {
        delete this.current.func;
        this.history.unshift(this._queue.shift());
    }
    /**
     * Executes the current `EventRecord` and recursively exeuctes
     * all remaining `EventRecords` in the queue.
     */
    _executeCurrent() {
        const current = this.current;
        const nextEvent = current.func.target(this.game);
        this._archiveCurrent();
        // Add the nextEvent to the internal queue, if necessary.
        if (isTrackedEvent(nextEvent) && nextEvent !== noop) {
            this._addEvent(nextEvent, current);
        }
        // While the queue is not empty, keep executing.
        if (this._queue.length > 0) {
            this._executeCurrent();
        }
    }
}

/**
 * Adds the events to the end of the game's event queue.
 *
 * If the events are `EventQueue`s, any events in the queues' `immediateEvents`
 * collections will be concatenated, followed by any events in the queues' `delayedEvents`.
 *
 * @template StateType The `GameInstance` state type. Optional, defaults to `any`.
 * @param events The events to be added.
 * @returns The `EventQueue` with all events in the queue's `delayedEvent` collection.
 */
const enqueue = (...events) => {
    const argImmediateEvents = [];
    const argDelayedEvents = [];
    events.forEach(event => {
        if (isEventQueue(event)) {
            argImmediateEvents.push(...event.immediateEvents);
            argDelayedEvents.push(...event.delayedEvents);
        }
        else {
            argImmediateEvents.push(event);
        }
    });
    return buildEventQueue([], argImmediateEvents.concat(argDelayedEvents));
};
/**
 * Constructs a `TrackedEvent`, which is a function that modifies a `GameInstance`
 * and tracks all changes as they occur.
 *
 * All modifications to game state within a Regal game should take place through a `TrackedEvent`.
 * This function is the standard way to declare a `TrackedEvent`.
 *
 * @template StateType The `GameInstance` state type. Optional, defaults to `any`.
 *
 * @param eventName The name of the `TrackedEvent`.
 * @param eventFunc The function that will be executed on a `GameInstance`.
 *
 * @returns The generated `TrackedEvent`.
 */
const on = (eventName, eventFunc) => {
    // Make the TrackedEvent callable like a function.
    const event = ((game) => {
        game.events.invoke(event);
    });
    event.eventName = eventName;
    event.target = eventFunc;
    event.then = buildThenMethod(event);
    event.thenq = (...events) => event.then(enqueue(...events));
    return event;
};

/** Builds an `EventFunction` that allows an `EventQueue` to be invoked like any other `EventFunction`. */
const queueInvocation = (immediateEvents, delayedEvents) => (game) => {
    // Will seem like an EventQueue to the GameInstance, but has no additional methods
    const fauxQueue = {
        delayedEvents,
        immediateEvents
    };
    game.events.invoke(fauxQueue);
};
/**
 * Builds an `EventQueue` from the given collections of events.
 *
 * @param immediateEvents The collection of events to be executed immediately.
 * @param delayedEvents The collection of events to be executed at the end of the queue.
 *
 * @returns The generated `EventQueue`.
 */
const buildEventQueue = (immediateEvents, delayedEvents) => {
    const queueInvocationFunction = queueInvocation(immediateEvents, delayedEvents);
    const eq = queueInvocationFunction;
    eq.target = queueInvocationFunction;
    eq.then = buildThenMethod(eq);
    eq.thenq = (...events) => eq.then(enqueue(...events));
    eq.enqueue = (...events) => {
        const resultQueue = enqueue(...events);
        return buildEventQueue(eq.immediateEvents, eq.delayedEvents.concat(resultQueue.delayedEvents));
    };
    eq.nq = eq.enqueue;
    eq.immediateEvents = immediateEvents;
    eq.delayedEvents = delayedEvents;
    return eq;
};
/**
 * Creates the `then` method for a `TrackedEvent`.
 * @param rootTarget The `TrackedEvent` targeted by the new method.
 * @returns The `then` method.
 */
const buildThenMethod = (rootTarget) => (...events) => {
    // Build a helper function to call `then` for a single TrackedEvent.
    const singleThen = (target, arg) => {
        let targetImmediateEvents;
        if (isEventQueue(target)) {
            // An EventQueue with at least one event in its delayedEvents collection cannot have its `then` method called.
            if (target.delayedEvents.length > 0) {
                throw new RegalError("Any enqueue instruction must happen at the end of the return statement.");
            }
            targetImmediateEvents = target.immediateEvents;
        }
        else {
            targetImmediateEvents = [target];
        }
        let argImmediateEvents;
        let argDelayedEvents;
        if (isEventQueue(arg)) {
            argImmediateEvents = arg.immediateEvents;
            argDelayedEvents = arg.delayedEvents;
        }
        else {
            argImmediateEvents = [arg];
            argDelayedEvents = [];
        }
        return buildEventQueue(targetImmediateEvents.concat(argImmediateEvents), argDelayedEvents);
    };
    // Call the helper `then` on every event, starting with the rootTarget.
    return events.reduce(singleThen, rootTarget);
};

/**
 * Conveys semantic meaning of an `OutputLine` to the client.
 */
var OutputLineType;
(function (OutputLineType) {
    /**
     * Standard output line; presented to the player normally. (Default)
     *
     * Use for most game content.
     */
    OutputLineType["NORMAL"] = "NORMAL";
    /**
     * Important line; emphasized to the player.
     *
     * Use when something important happens.
     */
    OutputLineType["MAJOR"] = "MAJOR";
    /**
     * Non-important line; emphasized less than `OutputLineType.NORMAL` lines,
     * and won't always be shown to the player.
     *
     * Use for repetitive/flavor text that might add a bit to the game experience,
     * but won't be missed if it isn't seen.
     */
    OutputLineType["MINOR"] = "MINOR";
    /**
     * Meant for debugging purposes; only visible when the `DEBUG` option is enabled.
     */
    OutputLineType["DEBUG"] = "DEBUG";
    /**
     * Signifies the start of a new section or scene in the game. (i.e. **West of House**)
     */
    OutputLineType["SECTION_TITLE"] = "SECTION_TITLE";
})(OutputLineType || (OutputLineType = {}));

/**
 * Constructs an `InstanceOutputInternal`.
 * @param game The `GameInstance` that owns this `InstanceOutputInternal`.
 * @param startingLineCount Optional starting ID for new `OutputLine`s. Defaults to 0.
 */
const buildInstanceOutput = (game, startingLineCount = 0) => new InstanceOutputImpl(game, startingLineCount);
class InstanceOutputImpl {
    constructor(game, startingLineCount) {
        this.game = game;
        this.lines = [];
        this._lineCount = startingLineCount;
    }
    get lineCount() {
        return this._lineCount;
    }
    recycle(newInstance) {
        return new InstanceOutputImpl(newInstance, this.lineCount);
    }
    writeLine(line, lineType = OutputLineType.NORMAL) {
        switch (lineType) {
            case OutputLineType.DEBUG:
                if (!this.game.options.debug) {
                    return;
                }
                break;
            case OutputLineType.MINOR:
                if (!this.game.options.showMinor) {
                    return;
                }
                break;
        }
        const outputLine = {
            data: line,
            id: ++this._lineCount,
            type: lineType
        };
        this.lines.push(outputLine);
        this.game.events.current.trackOutputWrite(outputLine);
    }
    write(...lines) {
        lines.forEach(line => this.writeLine(line, OutputLineType.NORMAL));
    }
    writeNormal(...lines) {
        lines.forEach(line => this.writeLine(line, OutputLineType.NORMAL));
    }
    writeMajor(...lines) {
        lines.forEach(line => this.writeLine(line, OutputLineType.MAJOR));
    }
    writeMinor(...lines) {
        lines.forEach(line => this.writeLine(line, OutputLineType.MINOR));
    }
    writeDebug(...lines) {
        lines.forEach(line => this.writeLine(line, OutputLineType.DEBUG));
    }
    writeTitle(line) {
        this.writeLine(line, OutputLineType.SECTION_TITLE);
    }
}

/**
 * Constructs a new `GameInstance` with optional `GameOption` overrides.
 *
 * @template StateType The state property's type. Optional, defaults to `any`.
 * @param optOverrides Any option overrides preferred for this specific instance.
 * Must be allowed by the static configuration's `allowOverrides` option.
 */
const buildGameInstance = (optOverrides) => {
    if (optOverrides !== undefined) {
        return new GameInstanceImpl({
            optionsBuilder: game => buildInstanceOptions(game, optOverrides)
        });
    }
    return new GameInstanceImpl();
};
/**
 * Implementation of `GameInstanceInternal`.
 * @template StateType The state property's type. Optional, defaults to `any`.
 */
class GameInstanceImpl {
    /**
     * Constructs a `GameInstanceImpl` with the given `InstanceX` constructor functions.
     */
    constructor({ agentsBuilder = buildInstanceAgents, eventsBuilder = buildInstanceEvents, outputBuilder = buildInstanceOutput, optionsBuilder = buildInstanceOptions, randomBuilder = buildInstanceRandom } = {}) {
        if (ContextManager.isContextStatic()) {
            throw new RegalError("Cannot construct a GameInstance outside of a game cycle.");
        }
        this.options = optionsBuilder(this);
        this.events = eventsBuilder(this);
        this.agents = agentsBuilder(this);
        this.output = outputBuilder(this);
        this.random = randomBuilder(this);
        this.state = buildActiveAgentProxy(0, this);
    }
    recycle(newOptions) {
        return new GameInstanceImpl(this._buildRecycleCtor(newOptions));
    }
    using(resource) {
        if (isAgent(resource) || resource instanceof Array) {
            return activateAgent(this, resource);
        }
        if (resource === undefined) {
            throw new RegalError("Resource must be defined.");
        }
        const returnObj = {};
        for (const key in resource) {
            if (resource.hasOwnProperty(key)) {
                const agent = resource[key];
                if (isAgent(agent)) {
                    returnObj[key] = activateAgent(this, agent);
                }
                else {
                    throw new RegalError(`Invalid agent in resource at key <${key}>.`);
                }
            }
        }
        return returnObj;
    }
    revert(revertTo = 0) {
        if (revertTo !== 0) {
            if (revertTo < 0) {
                throw new RegalError("revertTo must be zero or greater.");
            }
            if (!this.options.trackAgentChanges) {
                throw new RegalError("In order to revert to an intermediate event ID, GameOptions.trackAgentChanges must be true.");
            }
        }
        const ctor = this._buildRecycleCtor();
        ctor.randomBuilder = this._buildRandomRevertCtor(revertTo); // Revert random value stream
        const newInstance = new GameInstanceImpl(ctor);
        this._buildAgentRevertFunc(revertTo)(newInstance); // Revert agent changes
        return newInstance;
    }
    /** Internal helper that builds the `InstanceX` constructors for recycling. */
    _buildRecycleCtor(newOptions) {
        const opts = newOptions === undefined ? this.options.overrides : newOptions;
        // Include this instance's seed if it was generated (not specified by the user)
        let genSeed;
        if (opts.seed === undefined) {
            genSeed = this.options.seed;
        }
        return {
            agentsBuilder: game => this.agents.recycle(game),
            eventsBuilder: game => this.events.recycle(game),
            optionsBuilder: game => buildInstanceOptions(game, opts, genSeed),
            outputBuilder: game => this.output.recycle(game),
            randomBuilder: game => this.random.recycle(game)
        };
    }
    /**
     * Internal helper that builds an `InstanceRandom` constructor with its `numGenerations`
     * set to the appropriate revert event.
     */
    _buildRandomRevertCtor(revertTo) {
        return (game) => {
            let numGens = this.random.numGenerations;
            const eventsWithRandoms = this.events.history.filter(er => er.randoms !== undefined && er.randoms.length > 0);
            if (eventsWithRandoms.length > 0) {
                const lastEvent = eventsWithRandoms.find(er => er.id <= revertTo);
                if (lastEvent === undefined) {
                    // All random values were generated after the target event
                    numGens =
                        eventsWithRandoms[eventsWithRandoms.length - 1]
                            .randoms[0].id;
                }
                else {
                    // Otherwise, set num generations to its value AFTER (+1) the target event
                    const lastRandoms = lastEvent.randoms;
                    numGens = lastRandoms[lastRandoms.length - 1].id + 1;
                }
            }
            return buildInstanceRandom(game, numGens);
        };
    }
    /** Internal helper that builds a `TrackedEvent` to revert agent changes */
    _buildAgentRevertFunc(revertTo) {
        return on("REVERT", (game) => {
            const target = game.agents;
            for (const am of this.agents.agentManagers()) {
                const id = am.id;
                const props = Object.keys(am).filter(key => key !== "game" && key !== "id");
                for (const prop of props) {
                    const history = am.getPropertyHistory(prop);
                    const lastChangeIdx = history.findIndex(change => change.eventId <= revertTo);
                    if (lastChangeIdx === -1) {
                        // If all changes to the property happened after the target event, delete/reset it
                        if (StaticAgentRegistry.hasAgentProperty(id, prop)) {
                            const newVal = StaticAgentRegistry.getAgentProperty(id, prop);
                            target.setAgentProperty(id, prop, newVal);
                        }
                        else {
                            target.deleteAgentProperty(id, prop);
                        }
                    }
                    else {
                        // Otherwise, set the property to its value right after the target event
                        const targetVal = history[lastChangeIdx].final;
                        const currentVal = target.getAgentProperty(id, prop);
                        if (targetVal !== currentVal) {
                            const areEqAgents = isAgentReference(targetVal) &&
                                isAgent(currentVal) &&
                                targetVal.refId === currentVal.id;
                            const areEqAgentArrs = isAgentArrayReference(targetVal) &&
                                isAgent(currentVal) &&
                                targetVal.arRefId === currentVal.id;
                            if (!areEqAgents && !areEqAgentArrs) {
                                target.setAgentProperty(id, prop, targetVal);
                            }
                        }
                    }
                }
            }
        });
    }
}

/** Builds the proxy handler for an active agent proxy. */
const activeAgentProxyHandler = (id, game) => ({
    get(target, property) {
        return game.agents.hasAgentProperty(id, property)
            ? game.agents.getAgentProperty(id, property)
            : Reflect.get(target, property);
    },
    set(target, property, value) {
        return game.agents.setAgentProperty(id, property, value);
    },
    has(target, property) {
        return game.agents.hasAgentProperty(id, property);
    },
    deleteProperty(target, property) {
        return game.agents.deleteAgentProperty(id, property);
    },
    getOwnPropertyDescriptor(target, property) {
        if (property === "length" && target instanceof Array) {
            return Reflect.getOwnPropertyDescriptor(target, property);
        }
        else {
            return {
                configurable: true,
                enumerable: true,
                value: this.get(target, property)
            };
        }
    },
    ownKeys(target) {
        return game.agents.getAgentPropertyKeys(id);
    },
    getPrototypeOf(target) {
        return Object.getPrototypeOf(target);
    }
});
/**
 * Builds a proxy for an active agent. When an inactive agent is activated
 * by a `GameInstance`, it is considered active.
 *
 * The proxy wraps an empty object and has no tangible connection to the agent
 * which it is imitating. All calls to the proxy are forwarded to the
 * `GameInstance`'s `InstanceAgentsInternal`, simulating the behavior of normal object.
 *
 * @param id    The proxy agent's id.
 * @param game  The `GameInstance` of the current context.
 */
const buildActiveAgentProxy = (id, game) => new Proxy({}, activeAgentProxyHandler(id, game));
/**
 * Builds a proxy for an active agent array. An agent array is an array
 * that is treated like an agent. All arrays that are properties of
 * active agents become agent arrays.
 *
 * An agent array has all the same methods as a regular array.
 *
 * @param id    The agent array's id.
 * @param game  The `GameInstance` of the current context.
 */
const buildActiveAgentArrayProxy = (id, game) => new Proxy([], activeAgentProxyHandler(id, game));

/** Determines whether an object is an `AgentManager`. */
const isAgentManager = (o) => {
    return (o !== undefined && o.hasPropertyRecord !== undefined);
};

/** Whether the property is a positive integer, meaning its a valid agent id. */
const propertyIsAgentId = (property) => {
    const tryNum = Math.floor(Number(property));
    return tryNum !== Infinity && String(tryNum) === property && tryNum >= 0;
};

/**
 * Static class that manages all static agents used in the game.
 */
class StaticAgentRegistry {
    /** Gets the next available id for a newly instantiated static agent. */
    static getNextAvailableId() {
        return this._agentCount + 1;
    }
    /**
     * Returns whether the registry contains a static agent with the given id
     * and that agent has the given property.
     *
     * @param id The agent's id.
     * @param property The agent's property.
     */
    static hasAgentProperty(id, property) {
        return this.hasAgent(id) && this[id].hasOwnProperty(property);
    }
    /**
     * Gets a property of a static agent.
     *
     * @param agentId The agent's id.
     * @param propertyKey The name of the property.
     * @returns The value of the property.
     */
    static getAgentProperty(id, property) {
        if (!this.hasAgent(id)) {
            throw new RegalError(`No agent with the id <${id}> exists in the static registry.`);
        }
        return this[id][property];
    }
    /** Whether an agent with the given id is stored in the static agent registry. */
    static hasAgent(id) {
        return isAgent(this[id]);
    }
    /**
     * Adds an agent to the registry. Will error if the agent's id doesn't
     * equal the registry's next available id.
     * @param agent The agent to be added.
     */
    static addAgent(agent) {
        const id = agent.id;
        if (id !== this.getNextAvailableId()) {
            throw new RegalError(`Expected an agent with id <${this.getNextAvailableId()}>.`);
        }
        this[id] = agent;
        this._agentCount++;
    }
    /** Removes all agents from the registry. */
    static reset() {
        this._agentCount = 0;
        Object.keys(this)
            .filter(propertyIsAgentId)
            .forEach(key => delete this[key]);
    }
}
StaticAgentRegistry._agentCount = 0;

/** Type of modification done to an agent's property. */
var PropertyOperation;
(function (PropertyOperation) {
    /** The property was added to the agent. */
    PropertyOperation["ADDED"] = "ADDED";
    /** The property's value was changed. */
    PropertyOperation["MODIFIED"] = "MODIFIED";
    /** The property was deleted. */
    PropertyOperation["DELETED"] = "DELETED";
})(PropertyOperation || (PropertyOperation = {}));
/** Convert the given `PropertyChange` into the appropriate view for an `AgentManager`. */
const pcForAgentManager = (pc) => ({
    eventId: pc.eventId,
    eventName: pc.eventName,
    final: pc.final,
    init: pc.init,
    op: pc.op
});
/** Convert the given PropertyChange into the appropriate view for an `EventRecord`. */
const pcForEventRecord = (pc) => ({
    agentId: pc.agentId,
    final: pc.final,
    init: pc.init,
    op: pc.op,
    property: pc.property
});

/** Builds an implementation of `AgentManager` for the given `Agent` id and `GameInstance`. */
const buildAgentManager = (id, game) => new AgentManagerImpl(id, game);
/** Implementation of `AgentManager`. */
class AgentManagerImpl {
    constructor(id, game) {
        this.id = id;
        this.game = game;
    }
    hasPropertyRecord(property) {
        if (property === "constructor") {
            return false;
        }
        const history = this[property];
        return history !== undefined && history.length !== undefined;
    }
    getProperty(property) {
        const history = this.getPropertyHistory(property);
        let value;
        if (history.length > 0) {
            value = history[0].final;
        }
        return value;
    }
    getPropertyHistory(property) {
        return this.hasPropertyRecord(property) ? this[property] : [];
    }
    propertyWasDeleted(property) {
        const history = this.getPropertyHistory(property);
        return (history.length > 0 && history[0].op === PropertyOperation.DELETED);
    }
    setProperty(property, value) {
        let initValue;
        let opType;
        const history = this.getPropertyHistory(property);
        if (history.length === 0) {
            if (StaticAgentRegistry.hasAgentProperty(this.id, property)) {
                initValue = StaticAgentRegistry.getAgentProperty(this.id, property);
                opType = PropertyOperation.MODIFIED;
            }
            else {
                opType = PropertyOperation.ADDED;
            }
            if (initValue !== value) {
                this[property] = history;
            }
        }
        else {
            initValue = history[0].final;
            opType = this.propertyWasDeleted(property)
                ? PropertyOperation.ADDED
                : PropertyOperation.MODIFIED;
        }
        // If values are equal, don't record anything.
        if (initValue === value ||
            (isAgentReference(initValue) &&
                isAgentReference(value) &&
                initValue.refId === value.refId)) {
            return;
        }
        const event = this.game.events.current;
        const propChange = {
            agentId: this.id,
            eventId: event.id,
            eventName: event.name,
            final: value,
            init: initValue,
            op: opType,
            property: property.toString()
        };
        this.recordChange(event, propChange, history);
    }
    deleteProperty(property) {
        if (this.propertyWasDeleted(property)) {
            return;
        }
        let initValue;
        const history = this.getPropertyHistory(property);
        if (history.length === 0) {
            if (StaticAgentRegistry.hasAgentProperty(this.id, property)) {
                initValue = StaticAgentRegistry.getAgentProperty(this.id, property);
            }
            else {
                return;
            }
            this[property] = history;
        }
        else {
            initValue = history[0].final;
        }
        const event = this.game.events.current;
        const propChange = {
            agentId: this.id,
            eventId: event.id,
            eventName: event.name,
            final: undefined,
            init: initValue,
            op: PropertyOperation.DELETED,
            property: property.toString()
        };
        this.recordChange(event, propChange, history);
    }
    /**
     * Internal helper method to record a change in the `AgentManager`'s property
     * history and the `EventRecord` appropriately, depending on the value of the
     * `trackAgentChanges` game option.
     *
     * @param event The `EventRecord` in which the change is tracked.
     * @param propChange The `PropertyChange` to record.
     * @param history The property history to modify.
     */
    recordChange(event, propChange, history) {
        const trackAgentChanges = this.game.options.trackAgentChanges;
        // If trackAgentChanges is enabled, record it in the event record and the agent manager.
        if (trackAgentChanges) {
            event.trackChange(pcForEventRecord(propChange));
            history.unshift(pcForAgentManager(propChange));
        }
        else {
            if (history.length > 2) {
                throw new RegalError("Property history length cannot be greater than two when trackAgentChanges is disabled.");
            }
            // A change should be replaced if it happened during the same event,
            // or if the change happened after any potential recycling
            const shouldReplaceSingle = (pc) => pc.eventId === event.id || pc.eventId > DEFAULT_EVENT_ID;
            // If the property history has two changes, update the more recent one.
            // If property history has only change, check when the change happened.
            if (history.length === 2 ||
                (history.length === 1 && shouldReplaceSingle(history[0]))) {
                history[0] = pcForAgentManager(propChange);
            }
            else {
                // If the change happened after the game cycle began, replace it with the new change.
                history.unshift(pcForAgentManager(propChange));
            }
        }
    }
}

/**
 * Builds an implementation of `InstanceAgentsInternal` for the given `GameInstance`
 * @param game The `GameInstance`.
 * @param nextId The next agent ID to start activation at (optional).
 */
const buildInstanceAgents = (game, nextId) => new InstanceAgentsImpl(game, nextId);
/** Implementation of `InstanceAgentsInternal`. */
class InstanceAgentsImpl {
    constructor(game, nextId) {
        this.game = game;
        this.createAgentManager(0);
        this._nextId =
            nextId !== undefined
                ? nextId
                : StaticAgentRegistry.getNextAvailableId();
    }
    get nextId() {
        return this._nextId;
    }
    agentManagers() {
        return Object.keys(this)
            .filter(propertyIsAgentId)
            .map(key => this[key]);
    }
    reserveNewId() {
        const id = this._nextId;
        this._nextId++;
        this.createAgentManager(id);
        return id;
    }
    createAgentManager(id) {
        const am = buildAgentManager(id, this.game);
        this[id] = am;
        return am;
    }
    getAgentProperty(id, property) {
        const am = this.getAgentManager(id);
        let value;
        if (!isAgentManager(am)) {
            if (!StaticAgentRegistry.hasAgent(id)) {
                throw new RegalError(`No agent with the id <${id}> exists.`);
            }
            value = StaticAgentRegistry.getAgentProperty(id, property);
        }
        else {
            if (property === "id") {
                value = id;
            }
            else if (am.hasPropertyRecord(property)) {
                value = am.getProperty(property);
            }
            else if (StaticAgentRegistry.hasAgent(id)) {
                value = StaticAgentRegistry.getAgentProperty(id, property);
            }
        }
        if (isAgent(value)) {
            if (value instanceof Array) {
                value = buildActiveAgentArrayProxy(value.id, this.game);
            }
            else {
                value = buildActiveAgentProxy(value.id, this.game);
            }
        }
        else if (isAgentReference(value)) {
            value = buildActiveAgentProxy(value.refId, this.game);
        }
        else if (isAgentArrayReference(value)) {
            value = buildActiveAgentArrayProxy(value.arRefId, this.game);
        }
        return value;
    }
    getAgentPropertyKeys(id) {
        const am = this.getAgentManager(id);
        let keys = [];
        if (StaticAgentRegistry.hasAgent(id)) {
            const staticKeys = Object.keys(StaticAgentRegistry[id]);
            const instanceKeys = am === undefined ? [] : Object.keys(am);
            const keySet = new Set(staticKeys.concat(instanceKeys));
            keys = [...keySet]; // Remove duplicate keys
        }
        else {
            keys = Object.keys(am);
        }
        return keys.filter(key => this.hasAgentProperty(id, key));
    }
    setAgentProperty(id, property, value) {
        if (property === "id" || property === "game") {
            throw new RegalError(`The agent's <${property}> property cannot be set.`);
        }
        let am = this.getAgentManager(id);
        if (!isAgentManager(am)) {
            if (!StaticAgentRegistry.hasAgent(id)) {
                throw new RegalError(`No agent with the id <${id}> exists.`);
            }
            am = this.createAgentManager(id);
        }
        if (isAgent(value)) {
            if (value.id < 0) {
                const newId = this.reserveNewId();
                value.id = newId;
                value = this.game.using(value);
            }
            value =
                value instanceof Array
                    ? new AgentArrayReference(value.id)
                    : new AgentReference(value.id);
        }
        else if (value instanceof Array) {
            value.id = this.reserveNewId();
            value = this.game.using(value);
            value = new AgentArrayReference(value.id);
        }
        am.setProperty(property, value);
        return true;
    }
    hasAgentProperty(id, property) {
        const am = this.getAgentManager(id);
        const staticPropExists = StaticAgentRegistry.hasAgentProperty(id, property);
        if (!isAgentManager(am)) {
            if (!StaticAgentRegistry.hasAgent(id)) {
                throw new RegalError(`No agent with the id <${id}> exists.`);
            }
            return staticPropExists;
        }
        if (property === "id") {
            return true;
        }
        const propExists = am.hasPropertyRecord(property) || staticPropExists;
        return propExists && !am.propertyWasDeleted(property);
    }
    deleteAgentProperty(id, property) {
        if (property === "id" || property === "game") {
            throw new RegalError(`The agent's <${property}> property cannot be deleted.`);
        }
        let am = this.getAgentManager(id);
        if (!isAgentManager(am)) {
            if (!StaticAgentRegistry.hasAgent(id)) {
                throw new RegalError(`No agent with the id <${id}> exists.`);
            }
            am = this.createAgentManager(id);
        }
        am.deleteProperty(property);
        return true;
    }
    getAgentManager(id) {
        const result = this[id];
        if (isAgentManager(result)) {
            return result;
        }
        return undefined;
    }
    recycle(newInstance) {
        const newAgents = buildInstanceAgents(newInstance, this.nextId);
        for (const formerAgent of this.agentManagers()) {
            const id = formerAgent.id;
            const am = newAgents.createAgentManager(id);
            const propsToAdd = Object.keys(formerAgent).filter(key => key !== "game" && key !== "id");
            // For each updated property on the old agent, add its last value to the new agent.
            propsToAdd.forEach(prop => {
                if (formerAgent.propertyWasDeleted(prop)) {
                    if (StaticAgentRegistry.hasAgentProperty(id, prop)) {
                        am.deleteProperty(prop); // Record deletions to static agents.
                    }
                    return; // If the property was deleted, don't add it to the new record.
                }
                let formerValue = formerAgent.getProperty(prop);
                if (isAgentReference(formerValue)) {
                    formerValue = new AgentReference(formerValue.refId);
                }
                am.setProperty(prop, formerValue);
            });
        }
        return newAgents;
    }
    scrubAgents() {
        const seen = new Set();
        const q = [0]; // Start at the state, which always has an id of zero
        while (q.length > 0) {
            const id = q.shift();
            seen.add(id);
            for (const prop of this.getAgentPropertyKeys(id)) {
                const val = this.getAgentProperty(id, prop);
                if (isAgent(val) && !seen.has(val.id)) {
                    q.push(val.id);
                }
            }
        }
        const waste = Object.keys(this)
            .filter(propertyIsAgentId)
            .filter(id => !seen.has(Number(id)));
        for (const id of waste) {
            delete this[id];
        }
    }
}

/**
 * Builds a proxy for an inactive agent. Before an agent is activated
 * by a `GameInstance`, it is considered inactive.
 *
 * Inactive agents are initialize-only, meaning that their properties
 * may optionally be set once, but they may not be read or modified
 * until the agent is activated.
 *
 * An exception to this rule is that inactive agents may be read and
 * modified in the game's static context (i.e. outside of a game cycle).
 * Agents created in the static context are called static agents, and
 * they still must be activated by a `GameInstance` before they can be
 * used in a game cycle.
 *
 * @param agent The agent to be proxied.
 * @returns The inactive agent proxy.
 */
const buildInactiveAgentProxy = (agent) => new Proxy(agent, {
    /** Hidden property that contains any initialized values. */
    tempValues: {},
    get(target, property) {
        if (property === "tempValues") {
            return this.tempValues;
        }
        if (property !== "id" &&
            property !== "refId" &&
            !ContextManager.isContextStatic()) {
            throw new RegalError("The properties of an inactive agent cannot be accessed within a game cycle.");
        }
        return Reflect.get(target, property);
    },
    set(target, property, value) {
        if (property === "id" && target.id < 0) {
            return Reflect.set(target, property, value);
        }
        if (ContextManager.isContextStatic()) {
            // When adding an array as a property of a static agent, we need to
            // treat that array like an agent and register a static id for it
            if (value instanceof Array && value.id === undefined) {
                value.id = StaticAgentRegistry.getNextAvailableId();
                StaticAgentRegistry.addAgent(value);
            }
            return Reflect.set(target, property, value);
        }
        else if (StaticAgentRegistry.hasAgent(target.id)) {
            throw new RegalError("This static agent must be activated before it may be modified.");
        }
        // Allow initial values to be set (like from a constructor) but ONLY ONCE.
        if (this.tempValues[property] !== undefined) {
            throw new RegalError("The properties of an inactive agent cannot be set within a game cycle.");
        }
        this.tempValues[property] = value;
        return true;
    },
    deleteProperty(target, property) {
        if (!ContextManager.isContextStatic()) {
            throw new RegalError("The properties of an inactive agent cannot be deleted within a game cycle.");
        }
        return Reflect.deleteProperty(target, property);
    }
});

/**
 * Returns an activated agent or agent array within the current game context.
 *
 * Once an agent is activated, its data is managed by the `GameInstance`.
 * An agent cannot be used until it is activated.
 *
 * @param game  The managing `GameInstance`.
 * @param agent The agent to be activated (not modified).
 */
const activateAgent = (game, agent) => {
    let id = agent.id;
    if (id === undefined || id < 0) {
        id = game.agents.reserveNewId();
        agent.id = id;
    }
    let activeAgent;
    let tempValues = agent.tempValues;
    if (tempValues === undefined) {
        tempValues = {};
    }
    if (agent instanceof Array) {
        tempValues.length = agent.length;
        Object.keys(agent)
            .filter(propertyIsAgentId)
            .forEach(key => (tempValues[key] = agent[key]));
        activeAgent = buildActiveAgentArrayProxy(id, game);
    }
    else {
        activeAgent = buildActiveAgentProxy(id, game);
    }
    for (const prop of Object.keys(tempValues)) {
        activeAgent[prop] = tempValues[prop];
    }
    return activeAgent;
};

/** Determines whether an object is an `Agent`. */
const isAgent = (o) => o !== undefined && o.id !== undefined;
/**
 * An object that is interacted with by the player in a Regal game.
 *
 * Every game object should inherit from `Agent`.
 */
class Agent {
    /**
     * Constructs a new `Agent`. This constructor should almost never be called
     * directly, but rather should be called with `super()`.
     *
     * If called in the game's static context (i.e. outside of a game cycle), a
     * static agent will be created, and an id will be reserved for this agent
     * for all game instances.
     */
    constructor() {
        if (ContextManager.isContextStatic()) {
            this.id = StaticAgentRegistry.getNextAvailableId();
            StaticAgentRegistry.addAgent(this);
        }
        else {
            this.id = -1;
        }
        return buildInactiveAgentProxy(this);
    }
}

/** Default implementation of `beforeUndoCommandHook`; always returns true. */
const returnTrue = (game) => true;
/**
 * Manager for the Game's API hooks.
 */
class HookManager {
    /**
     * Resets the API hooks to their default values.
     */
    static reset() {
        this.playerCommandHook = undefined;
        this.startCommandHook = undefined;
        this.beforeUndoCommandHook = returnTrue;
    }
}
/**
 * Executes whenever `Game.postUndoCommand` is called, before the undo operation is executed.
 * Defaults to always return true.
 * @returns Whether the undo operation is allowed.
 */
HookManager.beforeUndoCommandHook = returnTrue;

/**
 * Sets the function to be executed whenever a player command is sent to the Game API
 * via `Game.postPlayerCommand`.
 * @param handler A function that takes a string containing the player's command and
 * generates an `EventFunction`. May be an `EventFunction`, `TrackedEvent`, or `EventQueue`.
 */
const onPlayerCommand = (handler) => {
    if (HookManager.playerCommandHook !== undefined) {
        throw new RegalError("Cannot call onPlayerCommand more than once.");
    }
    if (handler === undefined) {
        throw new RegalError("Handler must be defined.");
    }
    // Generate a TrackedEvent called INPUT
    const trackedEvent = (cmd) => on("INPUT", game => {
        const activatedHandler = handler(cmd);
        // Allow the handler to be an EventFunction, a TrackedEvent, or an EventQueue
        if (isTrackedEvent(activatedHandler)) {
            return activatedHandler;
        }
        else {
            return activatedHandler(game);
        }
    });
    HookManager.playerCommandHook = trackedEvent;
};
/**
 * Sets the function to be executed whenever a start command is sent to the Game API
 * via `Game.postStartCommand`.
 * @param handler The `EventFunction` to be executed. May be an `EventFunction`, `TrackedEvent`, or `EventQueue`.
 */
const onStartCommand = (handler) => {
    if (HookManager.startCommandHook !== undefined) {
        throw new RegalError("Cannot call onStartCommand more than once.");
    }
    if (handler === undefined) {
        throw new RegalError("Handler must be defined.");
    }
    // Generate a TrackedEvent called START
    const trackedEvent = on("START", game => {
        // Allow the handler to be an EventFunction, a TrackedEvent, or an EventQueue
        if (isTrackedEvent(handler)) {
            return handler;
        }
        else {
            return handler(game);
        }
    });
    HookManager.startCommandHook = trackedEvent;
};

/**
 * Throws an error if `instance` or any of its properties are undefined.
 * @param instance The `GameInstance` to validate.
 */
const validateGameInstance = (instance) => {
    if (instance === undefined ||
        instance.agents === undefined ||
        instance.events === undefined ||
        instance.output === undefined ||
        instance.state === undefined) {
        throw new RegalError("Invalid GameInstance.");
    }
};
/**
 * Wraps an error into a `RegalError` (if it's not already) that is
 * parseable by a `GameResponse`.
 *
 * @param err Some error object; should have `name`, `stack`, and `message` properties.
 */
const wrapApiErrorAsRegalError = (err) => {
    if (!err || !err.name || !err.stack || !err.message) {
        return new RegalError("Invalid error object.");
    }
    // If err is already a RegalError, return it
    if (err.message.indexOf("RegalError:") !== -1) {
        return err;
    }
    // Else, create a RegalError
    const msg = `An error occurred while executing the request. Details: <${err.name}: ${err.message}>`;
    const newErr = new RegalError(msg);
    newErr.stack = err.stack;
    return newErr;
};
/**
 * Helper function to build a `GameResponse` based on the return values of
 * `Game.postPlayerCommand` or `Game.postStartCommand`, including any output logs.
 *
 * @param err Any error that was thrown. If defined, the response will be considered failed.
 * @param newInstance The new `GameInstance` to be returned to the client.
 */
const buildLogResponse = (err, newInstance) => {
    let response;
    if (err !== undefined) {
        const output = {
            error: err,
            wasSuccessful: false
        };
        response = {
            output
        };
    }
    else {
        const output = {
            log: newInstance.output.lines,
            wasSuccessful: true
        };
        response = {
            instance: newInstance,
            output
        };
    }
    return response;
};
const NOT_INITALIZED_ERROR_MSG = "Game has not been initalized. Did you remember to call Game.init?";
/**
 * Game API
 *
 * Used for external interaction with the game, and shouldn't be accessed
 * within the game itself.
 */
const Game = {
    get isInitialized() {
        return this._isInitialized;
    },
    init(metadata) {
        if (this._isInitialized) {
            throw new RegalError("Game has already been initialized.");
        }
        this._isInitialized = true;
        ContextManager.init();
        MetadataManager.setMetadata(metadata);
    },
    reset() {
        this._isInitialized = false;
        ContextManager.reset();
        HookManager.reset();
        StaticAgentRegistry.reset();
        MetadataManager.reset();
    },
    getMetadataCommand() {
        let metadata;
        let err;
        try {
            if (!this._isInitialized) {
                throw new RegalError(NOT_INITALIZED_ERROR_MSG);
            }
            metadata = MetadataManager.getMetadata();
        }
        catch (error) {
            err = wrapApiErrorAsRegalError(error);
        }
        const output = err !== undefined
            ? { error: err, wasSuccessful: false }
            : { metadata, wasSuccessful: true };
        return { output };
    },
    postPlayerCommand(instance, command) {
        let newInstance;
        let err;
        try {
            if (!this._isInitialized) {
                throw new RegalError(NOT_INITALIZED_ERROR_MSG);
            }
            const oldInstance = instance;
            validateGameInstance(oldInstance);
            if (command === undefined) {
                throw new RegalError("Command must be defined.");
            }
            if (HookManager.playerCommandHook === undefined) {
                throw new RegalError("onPlayerCommand has not been implemented by the game developer.");
            }
            newInstance = oldInstance.recycle();
            newInstance.agents.scrubAgents();
            const activatedEvent = HookManager.playerCommandHook(command);
            newInstance.events.invoke(activatedEvent);
        }
        catch (error) {
            err = wrapApiErrorAsRegalError(error);
        }
        return buildLogResponse(err, newInstance);
    },
    postStartCommand(options) {
        let newInstance;
        let err;
        try {
            if (!this._isInitialized) {
                throw new RegalError(NOT_INITALIZED_ERROR_MSG);
            }
            if (HookManager.startCommandHook === undefined) {
                throw new RegalError("onStartCommand has not been implemented by the game developer.");
            }
            newInstance = buildGameInstance(options);
            newInstance.events.invoke(HookManager.startCommandHook);
        }
        catch (error) {
            err = wrapApiErrorAsRegalError(error);
        }
        return buildLogResponse(err, newInstance);
    },
    postUndoCommand(instance) {
        let newInstance;
        let err;
        try {
            if (!this._isInitialized) {
                throw new RegalError(NOT_INITALIZED_ERROR_MSG);
            }
            const oldInstance = instance;
            validateGameInstance(oldInstance);
            if (!HookManager.beforeUndoCommandHook(instance)) {
                throw new RegalError("Undo is not allowed here.");
            }
            newInstance = oldInstance.revert();
        }
        catch (error) {
            err = wrapApiErrorAsRegalError(error);
        }
        return err !== undefined
            ? {
                output: {
                    error: err,
                    wasSuccessful: false
                }
            }
            : {
                instance: newInstance,
                output: {
                    wasSuccessful: true
                }
            };
    },
    postOptionCommand(instance, options) {
        let newInstance;
        let err;
        try {
            if (!this._isInitialized) {
                throw new RegalError(NOT_INITALIZED_ERROR_MSG);
            }
            const oldInstance = instance;
            validateGameInstance(oldInstance);
            const oldOverrideKeys = Object.keys(oldInstance.options.overrides);
            const newOptionKeys = Object.keys(options);
            const newOptions = {};
            oldOverrideKeys
                .filter(key => !newOptionKeys.includes(key))
                .forEach(key => (newOptions[key] = oldInstance.options[key]));
            newOptionKeys.forEach(key => (newOptions[key] = options[key]));
            newInstance = oldInstance.recycle(newOptions);
        }
        catch (error) {
            err = wrapApiErrorAsRegalError(error);
        }
        return err !== undefined
            ? {
                output: {
                    error: err,
                    wasSuccessful: false
                }
            }
            : {
                instance: newInstance,
                output: {
                    wasSuccessful: true
                }
            };
    },
    /** Internal variable to track whether this.init has been called. */
    _isInitialized: false
};

/**
 * Demonstrates delayed event queueing.
 *
 * For more information, see https://github.com/regal/regal.
 */
const hitGround = (item) => on(`HIT GROUND <${item}>`, game => {
    game.output.write(`${item} hits the ground. Thud!`);
});
const fall = (item) => on(`FALL <${item}>`, game => {
    game.output.write(`${item} falls.`);
    return enqueue(hitGround(item));
});
const drop = on("DROP ITEMS", game => {
    let q = enqueue();
    for (let item of game.state.items) {
        q = q.enqueue(fall(item));
    }
    return q;
});
const prepDelay = on("PREP DELAY", game => {
    game.state.items = ["Hat", "Duck", "Spoon"];
});
var delayedExecution = prepDelay.then(drop);

/**
 * Demonstrates immediate event queueing.
 *
 * For more information, see https://github.com/regal/regal.
 */
const learnSkill = (name, skill) => on(`LEARN SKILL <${skill}>`, game => {
    game.output.write(`${name} learned ${skill}!`);
});
const addItemToInventory = (name, item) => on(`ADD ITEM <${item}>`, game => {
    game.output.write(`Added ${item} to ${name}'s inventory.`);
});
const makeSword = (name) => on(`MAKE SWORD`, game => {
    game.output.write(`${name} made a sword!`);
    return learnSkill(name, "Blacksmithing")
        .then(addItemToInventory(name, "Sword"));
});
var immediateExecution = makeSword("King Arthur");

/**
 * Demonstrates using StateType and GameEventBuilder to create
 * parameterized events. Uses an agent array.
 *
 * For more information, see https://github.com/regal/regal.
 */
const on$1 = on;
const init = on$1("INIT", game => {
    game.state.num = 0;
    game.state.names = ["spot", "buddy", "lucky"];
});
const pick = on$1("PICK", game => {
    const choice = game.state.names[game.state.num];
    game.output.write(`You picked ${choice}!`);
    game.state.num++;
});
var statetypeAndArrays = init.then(pick, pick, pick);

/**
 * Demonstrates how to define and use an agent.
 *
 * For more information, see https://github.com/regal/regal.
 */
class Bucket extends Agent {
    constructor(size, contents, isFull) {
        super();
        this.size = size;
        this.contents = contents;
        this.isFull = isFull;
    }
}
const init$1 = on("INIT", game => {
    game.state.bucket = new Bucket(5, "famous chili", true);
});
const pour = on("POUR", game => {
    const bucket = game.state.bucket;
    if (bucket.isFull) {
        bucket.isFull = false;
        game.output.write(`You pour out the ${bucket.contents}.`);
    }
    else {
        game.output.write("The bucket is already empty!");
    }
});
var definingAgents = init$1.then(pour, pour);

/**
 * Throws an error because an inactive agent is accessed within a game cycle.
 *
 * For more information, see https://github.com/regal/regal.
 */
class Bucket$1 extends Agent {
    constructor(size, contents, isFull) {
        super();
        this.size = size;
        this.contents = contents;
        this.isFull = isFull;
    }
}
const illegalEvent = on("EVENT", game => {
    const waterBucket = new Bucket$1(1, "water", true);
    waterBucket.isFull = false; // Uh-oh!
});

/**
 * Demonstrates all the ways that agents can be activated implicitly.
 *
 * For more information, see https://github.com/regal/regal.
 */
class Parent extends Agent {
    constructor(num, child // Optional child property
    ) {
        super();
        this.num = num;
        this.child = child;
    }
}
class MultiParent extends Agent {
    constructor(num, children = [] // Default to an empty array
    ) {
        super();
        this.num = num;
        this.children = children;
    }
}
const implicit1 = on("IMPLICIT 1", game => {
    game.state.myAgent = new Parent(1); // #1 is activated by GameInstance.state
    game.state.myAgent.child = new Parent(2); // #2 is activated by #1
});
const implicit2 = on("IMPLICIT 2", game => {
    const p = new Parent(1, new Parent(2)); // #1 and #2 are both inactive
    game.state.myAgent = p; // #1 and #2 are activated by GameInstance.state
});
const implicit3 = on("IMPLICIT 3", game => {
    const mp = new MultiParent(1, [new Parent(2), new Parent(3)]); // #1, #2, and #3 are inactive
    game.state.myAgent = mp; // #1, #2, and #3 are activated by GameInstance.state
});
const implicit4 = on("IMPLICIT 4", game => {
    game.state.myAgent = new MultiParent(1); // #1 is activated by GameInstance.state
    game.state.myAgent.children = [new Parent(2), new Parent(3)]; // #2 and #3 are activated by #1
});
const implicit5 = on("IMPLICIT 5", game => {
    game.state.myAgent = new MultiParent(1, [new Parent(2)]); // #1 and #2 are activated by GameInstance.state
    game.state.myAgent.children.push(new Parent(3)); // #3 is activated by #1
});
var implicitActivation = implicit1.then(implicit2, implicit3, implicit4, implicit5);

var makeBundle = (game) => {
    return {
        getMetadataCommand: game.getMetadataCommand.bind(game),
        postPlayerCommand: game.postPlayerCommand.bind(game),
        postStartCommand: game.postStartCommand.bind(game),
        postUndoCommand: game.postUndoCommand.bind(game),
        postOptionCommand: game.postOptionCommand.bind(game)
    };
};

const SNIPPETS = {
    immediate: immediateExecution,
    delay: delayedExecution,
    statetype: statetypeAndArrays,
    agent: definingAgents,
    illegal: illegalEvent,
    implicit: implicitActivation
};
//~ Hooks ~//
onStartCommand(game => {
    game.output.write("Startup successful.");
    game.output.write(`Possible snippets: ${Object.keys(SNIPPETS).join(", ")}`);
});
onPlayerCommand(command => game => {
    const cleanCmd = command.toLowerCase().trim();
    const snippet = SNIPPETS[cleanCmd];
    if (snippet === undefined) {
        game.output.write(`No snippet exists for command: ${command}.`);
        game.output.write(`Possible snippets: ${Object.keys(SNIPPETS).join(", ")}`);
    }
    else {
        return snippet.thenq(on("END", game => game.output.write("", "(End of snippet)")));
    }
});

/* Initialize game */
Game.init({
  "name": "regal-demo-snippets",
  "author": "Joe Cowman <joe.r.cowman@gmail.com> (http://joecowman.com)",
  "description": ""
});
/* Generate bundle */
const bundledGame = makeBundle(Game);

module.exports = bundledGame;
