/** 
* regal-demo-snippets
* by Joe Cowman <joe.r.cowman@gmail.com> (http://joecowman.com)
*
* Powered by the Regal Framework (https://github.com/regal/regal).
*/
"use strict";var Prando=function(){function e(t){this._value=NaN,this._seed="string"==typeof t?this.hashCode(t):"number"==typeof t?this.getSafeSeed(t):this.getSafeSeed(e.MIN+Math.floor((e.MAX-e.MIN)*Math.random())),this.reset()}return e.prototype.next=function(t,n){return void 0===t&&(t=0),void 0===n&&(n=1),this.recalculate(),this.map(this._value,e.MIN,e.MAX,t,n)},e.prototype.nextInt=function(t,n){return void 0===t&&(t=10),void 0===n&&(n=100),this.recalculate(),Math.floor(this.map(this._value,e.MIN,e.MAX,t,n+1))},e.prototype.nextString=function(e,t){void 0===e&&(e=16),void 0===t&&(t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");for(var n="";n.length<e;)n+=this.nextChar(t);return n},e.prototype.nextChar=function(e){return void 0===e&&(e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"),this.recalculate(),e.substr(this.nextInt(0,e.length-1),1)},e.prototype.nextArrayItem=function(e){return this.recalculate(),e[this.nextInt(0,e.length-1)]},e.prototype.nextBoolean=function(){return this.recalculate(),this._value>.5},e.prototype.skip=function(e){for(void 0===e&&(e=1);e-- >0;)this.recalculate()},e.prototype.reset=function(){this._value=this._seed},e.prototype.recalculate=function(){this._value=this.xorshift(this._value)},e.prototype.xorshift=function(e){return e^=e<<13,e^=e>>17,e^=e<<5},e.prototype.map=function(e,t,n,r,i){return(e-t)/(n-t)*(i-r)+r},e.prototype.hashCode=function(e){var t=0;if(e)for(var n=e.length,r=0;r<n;r++)t=(t<<5)-t+e.charCodeAt(r),t|=0,t=this.xorshift(t);return this.getSafeSeed(t)},e.prototype.getSafeSeed=function(e){return 0===e?1:e},e.MIN=-2147483648,e.MAX=2147483647,e}();class ContextManager{static isContextStatic(){return this._contextIsStatic}static reset(){this._contextIsStatic=!0}static init(){this._contextIsStatic=!1}}ContextManager._contextIsStatic=!0;const isAgentArrayReference=e=>e&&void 0!==e.arRefId;class AgentArrayReference{constructor(e){this.arRefId=e}}const isAgentReference=e=>e&&void 0!==e.refId;class AgentReference{constructor(e){this.refId=e}}const DEFAULT_GAME_OPTIONS={allowOverrides:!0,debug:!1,seed:void 0,showMinor:!0,trackAgentChanges:!1},OPTION_KEYS=Object.keys(DEFAULT_GAME_OPTIONS);class RegalError extends Error{constructor(e){super(`RegalError: ${e}`),Object.setPrototypeOf(this,new.target.prototype)}}const EXPANDED_CHARSET="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()-_=+{}[]|;:<>,.?",ALHPANUMERIC_CHARSET="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",ALPHABET_CHARSET="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",NUMBERS_CHARSET="0123456789";var charsets=Object.freeze({EXPANDED_CHARSET:EXPANDED_CHARSET,ALHPANUMERIC_CHARSET:ALHPANUMERIC_CHARSET,ALPHABET_CHARSET:ALPHABET_CHARSET,NUMBERS_CHARSET:"0123456789"});const buildInstanceRandom=(e,t=0)=>new InstanceRandomImpl(e,t);class InstanceRandomImpl{constructor(e,t){if(this.game=e,void 0===this.seed)throw new RegalError("Seed must be defined before an InstanceRandom can be constructed.");this._numGenerations=t,this._generator=new Prando(this.seed),this._generator.skip(t)}get seed(){return this.game.options.seed}get numGenerations(){return this._numGenerations}recycle(e){return new InstanceRandomImpl(e,this.numGenerations)}int(e,t){if(e>t)throw new RegalError(`Min <${e}> must be less than or equal to max <${t}>.`);const n=this._generator.nextInt(e,t);return this.trackRandom(n),this._numGenerations++,n}decimal(){const e=this._generator.next(0,1);return this.trackRandom(e),this._numGenerations++,e}string(e,t=EXPANDED_CHARSET){if(e<=0)throw new RegalError(`Length <${e}> must be greater than zero.`);if(new Set(t).size<2)throw new RegalError(`Charset <${t}> must have at least two unique characters.`);const n=this._generator.nextString(e,t);return this.trackRandom(n),this._numGenerations++,n}choice(e){if(void 0===e)throw new RegalError("Array must be defined.");const t=this._generator.nextInt(0,e.length-1);return this.trackRandom(t),this._numGenerations++,e[t]}boolean(){const e=this._generator.nextBoolean();return this.trackRandom(e),this._numGenerations++,e}trackRandom(e){this.game.events.current.trackRandom({id:this.numGenerations,value:e})}}const SEED_LENGTH=10,DEFAULT_SEED_CHARSET=EXPANDED_CHARSET,generateSeed=()=>(new Prando).nextString(10,DEFAULT_SEED_CHARSET),checkPropertyType=(e,t,n,r,i)=>{const o=e[t],a=typeof o;if(void 0!==o){if(a!==n)throw new RegalError(`The ${i} <${t}> is of type <${a}>, must be of type <${n}>.`)}else if(!r)throw new RegalError(`The ${i} <${t}> must be defined.`)},validateOptions=e=>{Object.keys(e).forEach(e=>{if(!OPTION_KEYS.includes(e))throw new RegalError(`Invalid option name <${e}>.`)});const t=(t,n)=>checkPropertyType(e,t,n,!0,"option");if(t("debug","boolean"),void 0!==e.allowOverrides)if(Array.isArray(e.allowOverrides)){if(e.allowOverrides.forEach(e=>{if(!OPTION_KEYS.includes(e))throw new RegalError(`The option <${e}> does not exist.`)}),e.allowOverrides.includes("allowOverrides"))throw new RegalError("The option <allowOverrides> is not allowed to be overridden.")}else if("boolean"!=typeof e.allowOverrides)throw new RegalError(`The option <allowOverrides> is of type <${typeof e.allowOverrides}>, must be of type <boolean> or <string[]>.`);t("showMinor","boolean"),t("trackAgentChanges","boolean"),t("seed","string")},ensureOverridesAllowed=(e,t)=>{if(void 0!==e.allowOverrides)throw new RegalError("The allowOverrides option can never be overridden.");if(Array.isArray(t)){const n=Object.keys(e).filter(e=>!t.includes(e));if(n.length>0)throw new RegalError(`The following option overrides are forbidden: <${n}>.`)}else if(!t&&Object.keys(e).length>0)throw new RegalError("No option overrides are allowed.")},OPTION_OVERRIDES_PROXY_HANDLER={set(){throw new RegalError("Cannot modify the properties of the InstanceOption option overrides.")}},INSTANCE_OPTIONS_PROXY_HANDLER={get:(e,t,n)=>void 0===e[t]?DEFAULT_GAME_OPTIONS[t]:Reflect.get(e,t,n),set(){throw new RegalError("Cannot modify the properties of InstanceOptions.")}},buildInstanceOptions=(e,t={},n)=>new InstanceOptionsImpl(e,t,n);class InstanceOptionsImpl{constructor(e,t,n){this.game=e,validateOptions(t);const r=MetadataManager.getMetadata().options;validateOptions(r);const i=void 0!==r.allowOverrides?r.allowOverrides:DEFAULT_GAME_OPTIONS.allowOverrides;ensureOverridesAllowed(t,i);const o=Object.keys(t);return Object.keys(r).filter(e=>!o.includes(e)).forEach(e=>this[e]=r[e]),o.forEach(e=>this[e]=t[e]),void 0===this.seed&&(this.seed=void 0!==n?n:generateSeed()),this.overrides=new Proxy(t,OPTION_OVERRIDES_PROXY_HANDLER),new Proxy(this,INSTANCE_OPTIONS_PROXY_HANDLER)}}var version="0.7.1";const METADATA_KEYS=["name","author","headline","description","homepage","repository","options","regalVersion"],copyAllowOverrides=e=>Array.isArray(e)?e.map(e=>e):e,copyOptions=e=>{const t={};void 0!==e.allowOverrides&&(t.allowOverrides=copyAllowOverrides(e.allowOverrides));for(const n of OPTION_KEYS.filter(e=>"allowOverrides"!==e))void 0!==e[n]&&(t[n]=e[n]);return t},copyMetadata=e=>({author:e.author,description:e.description,headline:e.headline,homepage:e.homepage,name:e.name,options:copyOptions(e.options),regalVersion:version,repository:e.repository}),optionalStringProps=["headline","description","homepage","repository"],validateMetadata=e=>{Object.keys(e).forEach(e=>{if(!METADATA_KEYS.includes(e))throw new RegalError(`Invalid metadata property <${e}>.`)});const t=(t,n,r)=>checkPropertyType(e,t,n,r,"metadata property");t("name","string",!1),t("author","string",!1);for(const e of optionalStringProps)t(e,"string",!0);t("options","object",!1),validateOptions(e.options)};class MetadataManager{static getMetadata(){if(void 0===MetadataManager._metadata)throw new RegalError("Metadata is not defined. Did you remember to load the config?");return copyMetadata(this._metadata)}static setMetadata(e){if(void 0!==e.regalVersion)throw new RegalError("regalVersion is specified internally and may not be modified.");e.hasOwnProperty("options")||(e.options={}),validateMetadata(e),MetadataManager._metadata=copyMetadata(e)}static reset(){MetadataManager._metadata=void 0}}const isTrackedEvent=e=>void 0!==e&&void 0!==e.target,isEventQueue=e=>void 0!==e&&void 0!==e.immediateEvents,noop=(()=>{const e=e=>void 0,t=e;return t.eventName="noop",t.target=e,t})(),DEFAULT_EVENT_ID=0,DEFAULT_EVENT_NAME="DEFAULT",buildEventRecord=(e=DEFAULT_EVENT_ID,t="DEFAULT",n=noop)=>new EventRecordImpl(e,t,n);class EventRecordImpl{constructor(e,t,n){this.id=e,this.name=t,this.func=n}trackOutputWrite(e){void 0===this.output&&(this.output=[]),this.output.push(e.id)}trackCausedEvent(...e){void 0===this.caused&&(this.caused=[]),this.caused.push(...e.map(e=>e.id)),e.forEach(e=>e.causedBy=this.id)}trackChange(e){void 0===this.changes&&(this.changes=[]),this.changes.push(e)}trackRandom(e){void 0===this.randoms&&(this.randoms=[]),this.randoms.push(e)}}const buildInstanceEvents=(e,t)=>void 0!==t?new InstanceEventsImpl(e,t):new InstanceEventsImpl(e);class InstanceEventsImpl{constructor(e,t=DEFAULT_EVENT_ID){this.game=e,this.history=[],this._queue=[],this._lastEventId=t}get current(){let e=this._queue[0];return void 0===e&&(e=buildEventRecord()),e}get lastEventId(){return this._lastEventId}invoke(e){this._addEvent(e),this._executeCurrent()}recycle(e){return new InstanceEventsImpl(e,this.lastEventId)}_addEvent(e,t){let n,r;isEventQueue(e)?(n=e.immediateEvents,r=e.delayedEvents):(n=[e],r=[]);const i=e=>buildEventRecord(++this._lastEventId,e.eventName,e),o=n.map(i),a=r.map(i);t&&(t.trackCausedEvent(...o),t.trackCausedEvent(...a)),this._queue=o.concat(this._queue),this._queue=this._queue.concat(a)}_archiveCurrent(){delete this.current.func,this.history.unshift(this._queue.shift())}_executeCurrent(){const e=this.current,t=e.func.target(this.game);this._archiveCurrent(),isTrackedEvent(t)&&t!==noop&&this._addEvent(t,e),this._queue.length>0&&this._executeCurrent()}}const enqueue=(...e)=>{const t=[],n=[];return e.forEach(e=>{isEventQueue(e)?(t.push(...e.immediateEvents),n.push(...e.delayedEvents)):t.push(e)}),buildEventQueue([],t.concat(n))},on=(e,t)=>{const n=e=>{e.events.invoke(n)};return n.eventName=e,n.target=t,n.then=buildThenMethod(n),n.thenq=((...e)=>n.then(enqueue(...e))),n},queueInvocation=(e,t)=>n=>{const r={delayedEvents:t,immediateEvents:e};n.events.invoke(r)},buildEventQueue=(e,t)=>{const n=queueInvocation(e,t),r=n;return r.target=n,r.then=buildThenMethod(r),r.thenq=((...e)=>r.then(enqueue(...e))),r.enqueue=((...e)=>{const t=enqueue(...e);return buildEventQueue(r.immediateEvents,r.delayedEvents.concat(t.delayedEvents))}),r.nq=r.enqueue,r.immediateEvents=e,r.delayedEvents=t,r},buildThenMethod=e=>(...t)=>{return t.reduce((e,t)=>{let n,r,i;if(isEventQueue(e)){if(e.delayedEvents.length>0)throw new RegalError("Any enqueue instruction must happen at the end of the return statement.");n=e.immediateEvents}else n=[e];return isEventQueue(t)?(r=t.immediateEvents,i=t.delayedEvents):(r=[t],i=[]),buildEventQueue(n.concat(r),i)},e)};var OutputLineType;!function(e){e.NORMAL="NORMAL",e.MAJOR="MAJOR",e.MINOR="MINOR",e.DEBUG="DEBUG",e.SECTION_TITLE="SECTION_TITLE"}(OutputLineType||(OutputLineType={}));const buildInstanceOutput=(e,t=0)=>new InstanceOutputImpl(e,t);class InstanceOutputImpl{constructor(e,t){this.game=e,this.lines=[],this._lineCount=t}get lineCount(){return this._lineCount}recycle(e){return new InstanceOutputImpl(e,this.lineCount)}writeLine(e,t=OutputLineType.NORMAL){switch(t){case OutputLineType.DEBUG:if(!this.game.options.debug)return;break;case OutputLineType.MINOR:if(!this.game.options.showMinor)return}const n={data:e,id:++this._lineCount,type:t};this.lines.push(n),this.game.events.current.trackOutputWrite(n)}write(...e){e.forEach(e=>this.writeLine(e,OutputLineType.NORMAL))}writeNormal(...e){e.forEach(e=>this.writeLine(e,OutputLineType.NORMAL))}writeMajor(...e){e.forEach(e=>this.writeLine(e,OutputLineType.MAJOR))}writeMinor(...e){e.forEach(e=>this.writeLine(e,OutputLineType.MINOR))}writeDebug(...e){e.forEach(e=>this.writeLine(e,OutputLineType.DEBUG))}writeTitle(e){this.writeLine(e,OutputLineType.SECTION_TITLE)}}const buildGameInstance=e=>void 0!==e?new GameInstanceImpl({optionsBuilder:t=>buildInstanceOptions(t,e)}):new GameInstanceImpl;class GameInstanceImpl{constructor({agentsBuilder:e=buildInstanceAgents,eventsBuilder:t=buildInstanceEvents,outputBuilder:n=buildInstanceOutput,optionsBuilder:r=buildInstanceOptions,randomBuilder:i=buildInstanceRandom}={}){if(ContextManager.isContextStatic())throw new RegalError("Cannot construct a GameInstance outside of a game cycle.");this.options=r(this),this.events=t(this),this.agents=e(this),this.output=n(this),this.random=i(this),this.state=buildActiveAgentProxy(0,this)}recycle(e){return new GameInstanceImpl(this._buildRecycleCtor(e))}using(e){if(isAgent(e)||e instanceof Array)return activateAgent(this,e);if(void 0===e)throw new RegalError("Resource must be defined.");const t={};for(const n in e)if(e.hasOwnProperty(n)){const r=e[n];if(!isAgent(r))throw new RegalError(`Invalid agent in resource at key <${n}>.`);t[n]=activateAgent(this,r)}return t}revert(e=0){if(0!==e){if(e<0)throw new RegalError("revertTo must be zero or greater.");if(!this.options.trackAgentChanges)throw new RegalError("In order to revert to an intermediate event ID, GameOptions.trackAgentChanges must be true.")}const t=this._buildRecycleCtor();t.randomBuilder=this._buildRandomRevertCtor(e);const n=new GameInstanceImpl(t);return this._buildAgentRevertFunc(e)(n),n}_buildRecycleCtor(e){const t=void 0===e?this.options.overrides:e;let n;return void 0===t.seed&&(n=this.options.seed),{agentsBuilder:e=>this.agents.recycle(e),eventsBuilder:e=>this.events.recycle(e),optionsBuilder:e=>buildInstanceOptions(e,t,n),outputBuilder:e=>this.output.recycle(e),randomBuilder:e=>this.random.recycle(e)}}_buildRandomRevertCtor(e){return t=>{let n=this.random.numGenerations;const r=this.events.history.filter(e=>void 0!==e.randoms&&e.randoms.length>0);if(r.length>0){const t=r.find(t=>t.id<=e);if(void 0===t)n=r[r.length-1].randoms[0].id;else{const e=t.randoms;n=e[e.length-1].id+1}}return buildInstanceRandom(t,n)}}_buildAgentRevertFunc(e){return on("REVERT",t=>{const n=t.agents;for(const t of this.agents.agentManagers()){const r=t.id,i=Object.keys(t).filter(e=>"game"!==e&&"id"!==e);for(const o of i){const i=t.getPropertyHistory(o),a=i.findIndex(t=>t.eventId<=e);if(-1===a)if(StaticAgentRegistry.hasAgentProperty(r,o)){const e=StaticAgentRegistry.getAgentProperty(r,o);n.setAgentProperty(r,o,e)}else n.deleteAgentProperty(r,o);else{const e=i[a].final,t=n.getAgentProperty(r,o);if(e!==t){const i=isAgentReference(e)&&isAgent(t)&&e.refId===t.id,a=isAgentArrayReference(e)&&isAgent(t)&&e.arRefId===t.id;i||a||n.setAgentProperty(r,o,e)}}}}})}}const activeAgentProxyHandler=(e,t)=>({get:(n,r)=>t.agents.hasAgentProperty(e,r)?t.agents.getAgentProperty(e,r):Reflect.get(n,r),set:(n,r,i)=>t.agents.setAgentProperty(e,r,i),has:(n,r)=>t.agents.hasAgentProperty(e,r),deleteProperty:(n,r)=>t.agents.deleteAgentProperty(e,r),getOwnPropertyDescriptor(e,t){return"length"===t&&e instanceof Array?Reflect.getOwnPropertyDescriptor(e,t):{configurable:!0,enumerable:!0,value:this.get(e,t)}},ownKeys:n=>t.agents.getAgentPropertyKeys(e),getPrototypeOf:e=>Object.getPrototypeOf(e)}),buildActiveAgentProxy=(e,t)=>new Proxy({},activeAgentProxyHandler(e,t)),buildActiveAgentArrayProxy=(e,t)=>new Proxy([],activeAgentProxyHandler(e,t)),isAgentManager=e=>void 0!==e&&void 0!==e.hasPropertyRecord,propertyIsAgentId=e=>{const t=Math.floor(Number(e));return t!==1/0&&String(t)===e&&t>=0};class StaticAgentRegistry{static getNextAvailableId(){return this._agentCount+1}static hasAgentProperty(e,t){return this.hasAgent(e)&&this[e].hasOwnProperty(t)}static getAgentProperty(e,t){if(!this.hasAgent(e))throw new RegalError(`No agent with the id <${e}> exists in the static registry.`);return this[e][t]}static hasAgent(e){return isAgent(this[e])}static addAgent(e){const t=e.id;if(t!==this.getNextAvailableId())throw new RegalError(`Expected an agent with id <${this.getNextAvailableId()}>.`);this[t]=e,this._agentCount++}static reset(){this._agentCount=0,Object.keys(this).filter(propertyIsAgentId).forEach(e=>delete this[e])}}var PropertyOperation;StaticAgentRegistry._agentCount=0,function(e){e.ADDED="ADDED",e.MODIFIED="MODIFIED",e.DELETED="DELETED"}(PropertyOperation||(PropertyOperation={}));const pcForAgentManager=e=>({eventId:e.eventId,eventName:e.eventName,final:e.final,init:e.init,op:e.op}),pcForEventRecord=e=>({agentId:e.agentId,final:e.final,init:e.init,op:e.op,property:e.property}),buildAgentManager=(e,t)=>new AgentManagerImpl(e,t);class AgentManagerImpl{constructor(e,t){this.id=e,this.game=t}hasPropertyRecord(e){if("constructor"===e)return!1;const t=this[e];return void 0!==t&&void 0!==t.length}getProperty(e){const t=this.getPropertyHistory(e);let n;return t.length>0&&(n=t[0].final),n}getPropertyHistory(e){return this.hasPropertyRecord(e)?this[e]:[]}propertyWasDeleted(e){const t=this.getPropertyHistory(e);return t.length>0&&t[0].op===PropertyOperation.DELETED}setProperty(e,t){let n,r;const i=this.getPropertyHistory(e);if(0===i.length?(StaticAgentRegistry.hasAgentProperty(this.id,e)?(n=StaticAgentRegistry.getAgentProperty(this.id,e),r=PropertyOperation.MODIFIED):r=PropertyOperation.ADDED,n!==t&&(this[e]=i)):(n=i[0].final,r=this.propertyWasDeleted(e)?PropertyOperation.ADDED:PropertyOperation.MODIFIED),n===t||isAgentReference(n)&&isAgentReference(t)&&n.refId===t.refId)return;const o=this.game.events.current,a={agentId:this.id,eventId:o.id,eventName:o.name,final:t,init:n,op:r,property:e.toString()};this.recordChange(o,a,i)}deleteProperty(e){if(this.propertyWasDeleted(e))return;let t;const n=this.getPropertyHistory(e);if(0===n.length){if(!StaticAgentRegistry.hasAgentProperty(this.id,e))return;t=StaticAgentRegistry.getAgentProperty(this.id,e),this[e]=n}else t=n[0].final;const r=this.game.events.current,i={agentId:this.id,eventId:r.id,eventName:r.name,final:void 0,init:t,op:PropertyOperation.DELETED,property:e.toString()};this.recordChange(r,i,n)}recordChange(e,t,n){if(this.game.options.trackAgentChanges)e.trackChange(pcForEventRecord(t)),n.unshift(pcForAgentManager(t));else{if(n.length>2)throw new RegalError("Property history length cannot be greater than two when trackAgentChanges is disabled.");const r=t=>t.eventId===e.id||t.eventId>DEFAULT_EVENT_ID;2===n.length||1===n.length&&r(n[0])?n[0]=pcForAgentManager(t):n.unshift(pcForAgentManager(t))}}}const buildInstanceAgents=(e,t)=>new InstanceAgentsImpl(e,t);class InstanceAgentsImpl{constructor(e,t){this.game=e,this.createAgentManager(0),this._nextId=void 0!==t?t:StaticAgentRegistry.getNextAvailableId()}get nextId(){return this._nextId}agentManagers(){return Object.keys(this).filter(propertyIsAgentId).map(e=>this[e])}reserveNewId(){const e=this._nextId;return this._nextId++,this.createAgentManager(e),e}createAgentManager(e){const t=buildAgentManager(e,this.game);return this[e]=t,t}getAgentProperty(e,t){const n=this.getAgentManager(e);let r;if(isAgentManager(n))"id"===t?r=e:n.hasPropertyRecord(t)?r=n.getProperty(t):StaticAgentRegistry.hasAgent(e)&&(r=StaticAgentRegistry.getAgentProperty(e,t));else{if(!StaticAgentRegistry.hasAgent(e))throw new RegalError(`No agent with the id <${e}> exists.`);r=StaticAgentRegistry.getAgentProperty(e,t)}return isAgent(r)?r=r instanceof Array?buildActiveAgentArrayProxy(r.id,this.game):buildActiveAgentProxy(r.id,this.game):isAgentReference(r)?r=buildActiveAgentProxy(r.refId,this.game):isAgentArrayReference(r)&&(r=buildActiveAgentArrayProxy(r.arRefId,this.game)),r}getAgentPropertyKeys(e){const t=this.getAgentManager(e);let n=[];if(StaticAgentRegistry.hasAgent(e)){const r=Object.keys(StaticAgentRegistry[e]),i=void 0===t?[]:Object.keys(t);n=[...new Set(r.concat(i))]}else n=Object.keys(t);return n.filter(t=>this.hasAgentProperty(e,t))}setAgentProperty(e,t,n){if("id"===t||"game"===t)throw new RegalError(`The agent's <${t}> property cannot be set.`);let r=this.getAgentManager(e);if(!isAgentManager(r)){if(!StaticAgentRegistry.hasAgent(e))throw new RegalError(`No agent with the id <${e}> exists.`);r=this.createAgentManager(e)}if(isAgent(n)){if(n.id<0){const e=this.reserveNewId();n.id=e,n=this.game.using(n)}n=n instanceof Array?new AgentArrayReference(n.id):new AgentReference(n.id)}else n instanceof Array&&(n.id=this.reserveNewId(),n=this.game.using(n),n=new AgentArrayReference(n.id));return r.setProperty(t,n),!0}hasAgentProperty(e,t){const n=this.getAgentManager(e),r=StaticAgentRegistry.hasAgentProperty(e,t);if(!isAgentManager(n)){if(!StaticAgentRegistry.hasAgent(e))throw new RegalError(`No agent with the id <${e}> exists.`);return r}return"id"===t||(n.hasPropertyRecord(t)||r)&&!n.propertyWasDeleted(t)}deleteAgentProperty(e,t){if("id"===t||"game"===t)throw new RegalError(`The agent's <${t}> property cannot be deleted.`);let n=this.getAgentManager(e);if(!isAgentManager(n)){if(!StaticAgentRegistry.hasAgent(e))throw new RegalError(`No agent with the id <${e}> exists.`);n=this.createAgentManager(e)}return n.deleteProperty(t),!0}getAgentManager(e){const t=this[e];if(isAgentManager(t))return t}recycle(e){const t=buildInstanceAgents(e,this.nextId);for(const e of this.agentManagers()){const n=e.id,r=t.createAgentManager(n);Object.keys(e).filter(e=>"game"!==e&&"id"!==e).forEach(t=>{if(e.propertyWasDeleted(t))return void(StaticAgentRegistry.hasAgentProperty(n,t)&&r.deleteProperty(t));let i=e.getProperty(t);isAgentReference(i)&&(i=new AgentReference(i.refId)),r.setProperty(t,i)})}return t}scrubAgents(){const e=new Set,t=[0];for(;t.length>0;){const n=t.shift();e.add(n);for(const r of this.getAgentPropertyKeys(n)){const i=this.getAgentProperty(n,r);isAgent(i)&&!e.has(i.id)&&t.push(i.id)}}const n=Object.keys(this).filter(propertyIsAgentId).filter(t=>!e.has(Number(t)));for(const e of n)delete this[e]}}const buildInactiveAgentProxy=e=>new Proxy(e,{tempValues:{},get(e,t){if("tempValues"===t)return this.tempValues;if("id"!==t&&"refId"!==t&&!ContextManager.isContextStatic())throw new RegalError("The properties of an inactive agent cannot be accessed within a game cycle.");return Reflect.get(e,t)},set(e,t,n){if("id"===t&&e.id<0)return Reflect.set(e,t,n);if(ContextManager.isContextStatic())return n instanceof Array&&void 0===n.id&&(n.id=StaticAgentRegistry.getNextAvailableId(),StaticAgentRegistry.addAgent(n)),Reflect.set(e,t,n);if(StaticAgentRegistry.hasAgent(e.id))throw new RegalError("This static agent must be activated before it may be modified.");if(void 0!==this.tempValues[t])throw new RegalError("The properties of an inactive agent cannot be set within a game cycle.");return this.tempValues[t]=n,!0},deleteProperty(e,t){if(!ContextManager.isContextStatic())throw new RegalError("The properties of an inactive agent cannot be deleted within a game cycle.");return Reflect.deleteProperty(e,t)}}),activateAgent=(e,t)=>{let n,r=t.id;(void 0===r||r<0)&&(r=e.agents.reserveNewId(),t.id=r);let i=t.tempValues;void 0===i&&(i={}),t instanceof Array?(i.length=t.length,Object.keys(t).filter(propertyIsAgentId).forEach(e=>i[e]=t[e]),n=buildActiveAgentArrayProxy(r,e)):n=buildActiveAgentProxy(r,e);for(const e of Object.keys(i))n[e]=i[e];return n},isAgent=e=>void 0!==e&&void 0!==e.id;class Agent{constructor(){return ContextManager.isContextStatic()?(this.id=StaticAgentRegistry.getNextAvailableId(),StaticAgentRegistry.addAgent(this)):this.id=-1,buildInactiveAgentProxy(this)}}const returnTrue=e=>!0;class HookManager{static reset(){this.playerCommandHook=void 0,this.startCommandHook=void 0,this.beforeUndoCommandHook=returnTrue}}HookManager.beforeUndoCommandHook=returnTrue;const onPlayerCommand=e=>{if(void 0!==HookManager.playerCommandHook)throw new RegalError("Cannot call onPlayerCommand more than once.");if(void 0===e)throw new RegalError("Handler must be defined.");HookManager.playerCommandHook=(t=>on("INPUT",n=>{const r=e(t);return isTrackedEvent(r)?r:r(n)}))},onStartCommand=e=>{if(void 0!==HookManager.startCommandHook)throw new RegalError("Cannot call onStartCommand more than once.");if(void 0===e)throw new RegalError("Handler must be defined.");const t=on("START",t=>isTrackedEvent(e)?e:e(t));HookManager.startCommandHook=t},validateGameInstance=e=>{if(void 0===e||void 0===e.agents||void 0===e.events||void 0===e.output||void 0===e.state)throw new RegalError("Invalid GameInstance.")},wrapApiErrorAsRegalError=e=>{if(!(e&&e.name&&e.stack&&e.message))return new RegalError("Invalid error object.");if(-1!==e.message.indexOf("RegalError:"))return e;const t=`An error occurred while executing the request. Details: <${e.name}: ${e.message}>`,n=new RegalError(t);return n.stack=e.stack,n},buildLogResponse=(e,t)=>{let n;if(void 0!==e){n={output:{error:e,wasSuccessful:!1}}}else{n={instance:t,output:{log:t.output.lines,wasSuccessful:!0}}}return n},NOT_INITALIZED_ERROR_MSG="Game has not been initalized. Did you remember to call Game.init?",Game={get isInitialized(){return this._isInitialized},init(e){if(this._isInitialized)throw new RegalError("Game has already been initialized.");this._isInitialized=!0,ContextManager.init(),MetadataManager.setMetadata(e)},reset(){this._isInitialized=!1,ContextManager.reset(),HookManager.reset(),StaticAgentRegistry.reset(),MetadataManager.reset()},getMetadataCommand(){let e,t;try{if(!this._isInitialized)throw new RegalError(NOT_INITALIZED_ERROR_MSG);e=MetadataManager.getMetadata()}catch(e){t=wrapApiErrorAsRegalError(e)}return{output:void 0!==t?{error:t,wasSuccessful:!1}:{metadata:e,wasSuccessful:!0}}},postPlayerCommand(e,t){let n,r;try{if(!this._isInitialized)throw new RegalError(NOT_INITALIZED_ERROR_MSG);const i=e;if(validateGameInstance(i),void 0===t)throw new RegalError("Command must be defined.");if(void 0===HookManager.playerCommandHook)throw new RegalError("onPlayerCommand has not been implemented by the game developer.");(n=i.recycle()).agents.scrubAgents();const o=HookManager.playerCommandHook(t);n.events.invoke(o)}catch(e){r=wrapApiErrorAsRegalError(e)}return buildLogResponse(r,n)},postStartCommand(e){let t,n;try{if(!this._isInitialized)throw new RegalError(NOT_INITALIZED_ERROR_MSG);if(void 0===HookManager.startCommandHook)throw new RegalError("onStartCommand has not been implemented by the game developer.");(t=buildGameInstance(e)).events.invoke(HookManager.startCommandHook)}catch(e){n=wrapApiErrorAsRegalError(e)}return buildLogResponse(n,t)},postUndoCommand(e){let t,n;try{if(!this._isInitialized)throw new RegalError(NOT_INITALIZED_ERROR_MSG);const r=e;if(validateGameInstance(r),!HookManager.beforeUndoCommandHook(e))throw new RegalError("Undo is not allowed here.");t=r.revert()}catch(e){n=wrapApiErrorAsRegalError(e)}return void 0!==n?{output:{error:n,wasSuccessful:!1}}:{instance:t,output:{wasSuccessful:!0}}},postOptionCommand(e,t){let n,r;try{if(!this._isInitialized)throw new RegalError(NOT_INITALIZED_ERROR_MSG);const i=e;validateGameInstance(i);const o=Object.keys(i.options.overrides),a=Object.keys(t),s={};o.filter(e=>!a.includes(e)).forEach(e=>s[e]=i.options[e]),a.forEach(e=>s[e]=t[e]),n=i.recycle(s)}catch(e){r=wrapApiErrorAsRegalError(e)}return void 0!==r?{output:{error:r,wasSuccessful:!1}}:{instance:n,output:{wasSuccessful:!0}}},_isInitialized:!1},hitGround=e=>on(`HIT GROUND <${e}>`,t=>{t.output.write(`${e} hits the ground. Thud!`)}),fall=e=>on(`FALL <${e}>`,t=>(t.output.write(`${e} falls.`),enqueue(hitGround(e)))),drop=on("DROP ITEMS",e=>{let t=enqueue();for(let n of e.state.items)t=t.enqueue(fall(n));return t}),prepDelay=on("PREP DELAY",e=>{e.state.items=["Hat","Duck","Spoon"]});var delayedExecution=prepDelay.then(drop);const learnSkill=(e,t)=>on(`LEARN SKILL <${t}>`,n=>{n.output.write(`${e} learned ${t}!`)}),addItemToInventory=(e,t)=>on(`ADD ITEM <${t}>`,n=>{n.output.write(`Added ${t} to ${e}'s inventory.`)}),makeSword=e=>on("MAKE SWORD",t=>(t.output.write(`${e} made a sword!`),learnSkill(e,"Blacksmithing").then(addItemToInventory(e,"Sword"))));var immediateExecution=makeSword("King Arthur");const on$1=on,init=on$1("INIT",e=>{e.state.num=0,e.state.names=["spot","buddy","lucky"]}),pick=on$1("PICK",e=>{const t=e.state.names[e.state.num];e.output.write(`You picked ${t}!`),e.state.num++});var statetypeAndArrays=init.then(pick,pick,pick);class Bucket extends Agent{constructor(e,t,n){super(),this.size=e,this.contents=t,this.isFull=n}}const init$1=on("INIT",e=>{e.state.bucket=new Bucket(5,"famous chili",!0)}),pour=on("POUR",e=>{const t=e.state.bucket;t.isFull?(t.isFull=!1,e.output.write(`You pour out the ${t.contents}.`)):e.output.write("The bucket is already empty!")});var definingAgents=init$1.then(pour,pour);class Bucket$1 extends Agent{constructor(e,t,n){super(),this.size=e,this.contents=t,this.isFull=n}}const illegalEvent=on("EVENT",e=>{new Bucket$1(1,"water",!0).isFull=!1});class Parent extends Agent{constructor(e,t){super(),this.num=e,this.child=t}}class MultiParent extends Agent{constructor(e,t=[]){super(),this.num=e,this.children=t}}const implicit1=on("IMPLICIT 1",e=>{e.state.myAgent=new Parent(1),e.state.myAgent.child=new Parent(2),e.output.write(`${e.state.myAgent.num} and ${e.state.myAgent.child.num} are active.`)}),implicit2=on("IMPLICIT 2",e=>{const t=new Parent(1,new Parent(2));e.state.myAgent=t,e.output.write(`${e.state.myAgent.num} and ${e.state.myAgent.child.num} are active.`)}),implicit3=on("IMPLICIT 3",e=>{const t=new MultiParent(1,[new Parent(2),new Parent(3)]);e.state.myAgent=t,e.output.write(`${e.state.myAgent.num}, ${e.state.myAgent.children[0].num}, and ${e.state.myAgent.children[1].num} are active.`)}),implicit4=on("IMPLICIT 4",e=>{e.state.myAgent=new MultiParent(1),e.state.myAgent.children=[new Parent(2),new Parent(3)],e.output.write(`${e.state.myAgent.num}, ${e.state.myAgent.children[0].num}, and ${e.state.myAgent.children[1].num} are active.`)}),implicit5=on("IMPLICIT 5",e=>{e.state.myAgent=new MultiParent(1,[new Parent(2)]),e.state.myAgent.children.push(new Parent(3)),e.output.write(`${e.state.myAgent.num}, ${e.state.myAgent.children[0].num}, and ${e.state.myAgent.children[1].num} are active.`)});var implicitActivation=implicit1.then(implicit2,implicit3,implicit4,implicit5);class CustomAgent extends Agent{constructor(e){super(),this.num=e}}const explicit1=on("EXPLICIT 1",e=>{const t=e.using(new CustomAgent(1));e.output.write(`${t.num} is active.`)}),explicit2=on("EXPLICIT 2",e=>{const t=e.using([new CustomAgent(1),new CustomAgent(2)]);e.output.write(`${t[0].num} and ${t[1].num} are active.`)}),explicit3=on("EXPLICIT 3",e=>{const{agent1:t,agent2:n}=e.using({agent1:new CustomAgent(1),agent2:new CustomAgent(2)});e.output.write(`${t.num} and ${n.num} are active.`)});var explicitActivation=explicit1.then(explicit2,explicit3);class Book extends Agent{constructor(e,t,n){super(),this.title=e,this.author=t,this.content=n}}const reallyLongString="To Mrs. Saville, England St. Petersburgh, Dec. 11th, 17- You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking...",NOVEL=new Book("Frankenstein","Mary Shelley",reallyLongString);NOVEL.title+=", or The Modern Prometheus";const read=on("READ",e=>{const t=e.using(NOVEL);e.output.write(`You open ${t.title}, by ${t.author}.`);const n=t.content.split(" ").slice(0,4).join(" ");e.output.write(`It begins, "${n}..."`)}),revise=(e,t)=>on("REVISE",n=>{const r=n.using(NOVEL);r.content=t+" "+r.content,r.author+=` (with a forward by ${e})`});var staticAgents=read.then(revise("Lars","Pancakes!")).then(read);const randos=on("RANDOS",e=>{const t=e.random.boolean();e.output.write(`Boolean -> ${t}`);const n=e.random.int(1,10);e.output.write(`Int -> ${n}`);const r=e.random.decimal();e.output.write(`Decimal -> ${r}`);const i=e.random.string(10);e.output.write(`String -> ${i}`)}),rstrings=on("RSTRINGS",e=>{const t=e.random.string(10,charsets.ALHPANUMERIC_CHARSET);e.output.write(`Alphanumeric -> ${t}`);const n=e.random.string(10,charsets.ALPHABET_CHARSET);e.output.write(`Alphabet -> ${n}`);const r=e.random.string(10,charsets.NUMBERS_CHARSET);e.output.write(`Numbers -> ${r}`);const i=e.random.string(10,charsets.NUMBERS_CHARSET+"ABCDEF");e.output.write(`Hex -> ${i}`);const o=e.random.string(10,"10");e.output.write(`Binary -> ${o}`),e.output.write(`Old MacDonald had a farm, ${e.random.string(5,"eio")}.`)});class Item extends Agent{constructor(e){super(),this.name=e}}const init$2=on("INIT",e=>{e.state.items=[new Item("Yo-Yo"),new Item("Pigeon"),new Item("Corn cob")]}),rpick=on("RPICK",e=>{const t=e.random.choice(e.state.items);e.output.write(`You picked the ${t.name}!`)});var random=randos.then(rstrings).then(init$2,rpick,rpick,rpick);const out=on("OUT",e=>{e.output.writeNormal("This is normal output. Most of your game's output will be this type."),e.output.write("InstanceOutput.write is just a shorthand for writeNormal!"),e.output.writeMajor("This is major output. Save this for really important stuff."),e.output.writeMinor("This is minor output. Use this for repetitive/flavor text that isn't necessary for the player to see."),e.output.writeDebug("This is debug output. It's only visible when the debug option is enabled."),e.output.writeTitle("This is a title.")});var makeBundle=e=>({getMetadataCommand:e.getMetadataCommand.bind(e),postPlayerCommand:e.postPlayerCommand.bind(e),postStartCommand:e.postStartCommand.bind(e),postUndoCommand:e.postUndoCommand.bind(e),postOptionCommand:e.postOptionCommand.bind(e)});const SNIPPETS={immediate:immediateExecution,delay:delayedExecution,statetype:statetypeAndArrays,agent:definingAgents,illegal:illegalEvent,implicit:implicitActivation,explicit:explicitActivation,static:staticAgents,random:random,output:out};onStartCommand(e=>{e.output.write("Startup successful."),e.options.debug&&e.output.write("debug is enabled."),e.options.showMinor||e.output.write("showMinor is disabled."),e.output.write(`Possible snippets: ${Object.keys(SNIPPETS).join(", ")}`)}),onPlayerCommand(e=>t=>{const n=e.toLowerCase().trim(),r=SNIPPETS[n];if(void 0!==r)return r.thenq(on("END",e=>e.output.write("","(End of snippet)")));t.output.write(`No snippet exists for command: ${e}.`),t.output.write(`Possible snippets: ${Object.keys(SNIPPETS).join(", ")}`)}),Game.init({options:{debug:!0},name:"regal-demo-snippets",author:"Joe Cowman <joe.r.cowman@gmail.com> (http://joecowman.com)",description:""});const bundledGame=makeBundle(Game);module.exports=bundledGame;
