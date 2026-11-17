(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/next/dist/client/components/bfcache-state-manager.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "useRouterBFCache", {
    enumerable: true,
    get: function() {
        return useRouterBFCache;
    }
});
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// When the flag is disabled, only track the currently active tree
const MAX_BF_CACHE_ENTRIES = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : 1;
function useRouterBFCache(activeTree, activeRenderTree, activeStateKey) {
    // The currently active entry. The entries form a linked list, sorted in
    // order of most recently active. This allows us to reuse parts of the list
    // without cloning, unless there's a reordering or removal.
    // TODO: Once we start tracking back/forward history at each route level,
    // we should use the history order instead. In other words, when traversing
    // to an existing entry as a result of a popstate event, we should maintain
    // the existing order instead of moving it to the front of the list. I think
    // an initial implementation of this could be to pass an incrementing id
    // to history.pushState/replaceState, then use that here for ordering.
    const [prevActiveEntry, setPrevActiveEntry] = (0, _react.useState)(()=>{
        const initialEntry = {
            tree: activeTree,
            renderTree: activeRenderTree,
            stateKey: activeStateKey,
            next: null
        };
        return initialEntry;
    });
    if (prevActiveEntry.tree === activeTree) {
        // Fast path. The active tree hasn't changed, so we can reuse the
        // existing state.
        return prevActiveEntry;
    }
    // The route tree changed. Note that this doesn't mean that the tree changed
    // *at this level* — the change may be due to a child route. Either way, we
    // need to either add or update the router tree in the bfcache.
    //
    // The rest of the code looks more complicated than it actually is because we
    // can't mutate the state in place; we have to copy-on-write.
    // Create a new entry for the active cache key. This is the head of the new
    // linked list.
    const newActiveEntry = {
        tree: activeTree,
        renderTree: activeRenderTree,
        stateKey: activeStateKey,
        next: null
    };
    // We need to append the old list onto the new list. If the head of the new
    // list was already present in the cache, then we'll need to clone everything
    // that came before it. Then we can reuse the rest.
    let n = 1;
    let oldEntry = prevActiveEntry;
    let clonedEntry = newActiveEntry;
    while(oldEntry !== null && n < MAX_BF_CACHE_ENTRIES){
        if (oldEntry.stateKey === activeStateKey) {
            // Fast path. This entry in the old list that corresponds to the key that
            // is now active. We've already placed a clone of this entry at the front
            // of the new list. We can reuse the rest of the old list without cloning.
            // NOTE: We don't need to worry about eviction in this case because we
            // haven't increased the size of the cache, and we assume the max size
            // is constant across renders. If we were to change it to a dynamic limit,
            // then the implementation would need to account for that.
            clonedEntry.next = oldEntry.next;
            break;
        } else {
            // Clone the entry and append it to the list.
            n++;
            const entry = {
                tree: oldEntry.tree,
                renderTree: oldEntry.renderTree,
                stateKey: oldEntry.stateKey,
                next: null
            };
            clonedEntry.next = entry;
            clonedEntry = entry;
        }
        oldEntry = oldEntry.next;
    }
    setPrevActiveEntry(newActiveEntry);
    return newActiveEntry;
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/client-boundary-params.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// Browser variant of `./client-boundary-params`. In the browser the params and
// searchParams are created at render time rather than dynamically tracked.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    createClientParams: null,
    createClientSearchParams: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    createClientParams: function() {
        return _paramsbrowser.createRenderParamsFromClient;
    },
    createClientSearchParams: function() {
        return _searchparamsbrowser.createRenderSearchParamsFromClient;
    }
});
const _paramsbrowser = __turbopack_context__.r("[project]/node_modules/next/dist/client/request/params.browser.js [app-client] (ecmascript)");
const _searchparamsbrowser = __turbopack_context__.r("[project]/node_modules/next/dist/client/request/search-params.browser.js [app-client] (ecmascript)");
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/client-page.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClientPageRoot", {
    enumerable: true,
    get: function() {
        return ClientPageRoot;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/node_modules/next/dist/client/route-params.js [app-client] (ecmascript)");
const _hooksclientcontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.js [app-client] (ecmascript)");
const _clientboundaryparams = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/client-boundary-params.browser.js [app-client] (ecmascript)");
function ClientPageRoot({ Component, serverProvidedParams }) {
    let searchParams;
    let params;
    if (serverProvidedParams !== null) {
        searchParams = serverProvidedParams.searchParams;
        params = serverProvidedParams.params;
    } else {
        // When Cache Components is enabled, the server does not pass the params as
        // props; they are parsed on the client and passed via context.
        const layoutRouterContext = (0, _react.use)(_approutercontextsharedruntime.LayoutRouterContext);
        params = layoutRouterContext !== null ? layoutRouterContext.parentParams : {};
        // This is an intentional behavior change: when Cache Components is enabled,
        // client segments receive the "canonical" search params, not the
        // rewritten ones. Users should either call useSearchParams directly or pass
        // the rewritten ones in from a Server Component.
        // TODO: Log a deprecation error when this object is accessed
        searchParams = (0, _routeparams.urlSearchParamsToParsedUrlQuery)((0, _react.use)(_hooksclientcontextsharedruntime.SearchParamsContext));
    }
    const clientSearchParams = (0, _clientboundaryparams.createClientSearchParams)(searchParams);
    const clientParams = (0, _clientboundaryparams.createClientParams)(params);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(Component, {
        params: clientParams,
        searchParams: clientSearchParams
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/client-segment.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ClientSegmentRoot", {
    enumerable: true,
    get: function() {
        return ClientSegmentRoot;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _clientboundaryparams = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/client-boundary-params.browser.js [app-client] (ecmascript)");
function ClientSegmentRoot({ Component, slots, serverProvidedParams }) {
    let params;
    if (serverProvidedParams !== null) {
        params = serverProvidedParams.params;
    } else {
        // When Cache Components is enabled, the server does not pass the params
        // as props; they are parsed on the client and passed via context.
        const layoutRouterContext = (0, _react.use)(_approutercontextsharedruntime.LayoutRouterContext);
        params = layoutRouterContext !== null ? layoutRouterContext.parentParams : {};
    }
    const clientParams = (0, _clientboundaryparams.createClientParams)(params);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(Component, {
        ...slots,
        params: clientParams
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/instant-validation/boundary.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    InstantValidationBoundaryContext: null,
    PlaceValidationBoundaryBelowThisLevel: null,
    RenderValidationBoundaryAtThisLevel: null,
    SlotMarker: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    InstantValidationBoundaryContext: function() {
        return _impl.InstantValidationBoundaryContext;
    },
    PlaceValidationBoundaryBelowThisLevel: function() {
        return _impl.PlaceValidationBoundaryBelowThisLevel;
    },
    RenderValidationBoundaryAtThisLevel: function() {
        return _impl.RenderValidationBoundaryAtThisLevel;
    },
    SlotMarker: function() {
        return _impl.SlotMarker;
    }
});
const _impl = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/instant-validation/impl.browser.js [app-client] (ecmascript)");
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/instant-validation/impl.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    InstantValidationBoundaryContext: null,
    PlaceValidationBoundaryBelowThisLevel: null,
    RenderValidationBoundaryAtThisLevel: null,
    SlotMarker: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    InstantValidationBoundaryContext: function() {
        return InstantValidationBoundaryContext;
    },
    PlaceValidationBoundaryBelowThisLevel: function() {
        return PlaceValidationBoundaryBelowThisLevel;
    },
    RenderValidationBoundaryAtThisLevel: function() {
        return RenderValidationBoundaryAtThisLevel;
    },
    SlotMarker: function() {
        return SlotMarker;
    }
});
const InstantValidationBoundaryContext = null;
const PlaceValidationBoundaryBelowThisLevel = null;
const RenderValidationBoundaryAtThisLevel = null;
const SlotMarker = null;
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/layout-router.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use client';
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    LoadingBoundaryProvider: null,
    default: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    LoadingBoundaryProvider: function() {
        return LoadingBoundaryProvider;
    },
    /**
 * OuterLayoutRouter handles the current segment as well as <Offscreen> rendering of other segments.
 * It can be rendered next to each other with a different `parallelRouterKey`, allowing for Parallel routes.
 */ default: function() {
        return OuterLayoutRouter;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
const _unresolvedthenable = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/unresolved-thenable.js [app-client] (ecmascript)");
const _errorboundary = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/error-boundary.js [app-client] (ecmascript)");
const _disablesmoothscroll = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js [app-client] (ecmascript)");
const _redirectboundary = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/redirect-boundary.js [app-client] (ecmascript)");
const _errorboundary1 = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js [app-client] (ecmascript)");
const _boundary = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/instant-validation/boundary.js [app-client] (ecmascript)");
const _createsegmentkey = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/router-reducer/create-segment-key.browser.js [app-client] (ecmascript)");
const _bfcachestatemanager = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/bfcache-state-manager.js [app-client] (ecmascript)");
const _apppaths = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/router/utils/app-paths.js [app-client] (ecmascript)");
const _hooksclientcontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/hooks-client-context.shared-runtime.js [app-client] (ecmascript)");
const _routeparams = __turbopack_context__.r("[project]/node_modules/next/dist/client/route-params.js [app-client] (ecmascript)");
const _rendertree = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/render-tree.js [app-client] (ecmascript)");
/**
 * Resolve the root scroll padding used by the viewport check.
 *
 * Computed lengths serialize as pixels, but percentages remain relative to
 * the scrollport. Preserve the existing behavior for values that still
 * contain unresolved CSS math.
 */ function getScrollPaddingTopInPixels(htmlElement, viewportHeight) {
    const scrollPaddingTop = getComputedStyle(htmlElement).scrollPaddingTop;
    const value = Number.parseFloat(scrollPaddingTop);
    if (!Number.isFinite(value) || value < 0) {
        return 0;
    }
    if (scrollPaddingTop.endsWith('px')) {
        return value;
    }
    if (scrollPaddingTop.endsWith('%')) {
        return value / 100 * viewportHeight;
    }
    return 0;
}
/**
 * Check where the top corner of the HTMLElement is relative to the usable
 * viewport.
 *
 * Scroll padding is resolved lazily so an empty Fragment does not trigger a
 * computed style read. The caller caches the value for the second check.
 */ function getScrollTargetState(instance, viewportHeight, getScrollPaddingTop) {
    const rects = instance.getClientRects();
    if (rects.length === 0) {
        return 0;
    }
    let elementTop = Number.POSITIVE_INFINITY;
    for(let i = 0; i < rects.length; i++){
        const rect = rects[i];
        if (rect.top < elementTop) {
            elementTop = rect.top;
        }
    }
    return elementTop >= getScrollPaddingTop() && elementTop <= viewportHeight ? 1 : 2;
}
/**
 * Find the DOM node for a hash fragment.
 * If `top` the page has to scroll to the top of the page. This mirrors the browser's behavior.
 * If the hash fragment is an id, the page has to scroll to the element with that id.
 * If the hash fragment is a name, the page has to scroll to the first element with that name.
 */ function getHashFragmentDomNode(hashFragment) {
    // If the hash fragment is `top` the page has to scroll to the top of the page.
    if (hashFragment === 'top') {
        return document.body;
    }
    // If the hash fragment is an id, the page has to scroll to the element with that id.
    return document.getElementById(hashFragment) ?? // If the hash fragment is a name, the page has to scroll to the first element with that name.
    document.getElementsByName(hashFragment)[0] ?? null;
}
/**
 * Uses Fragment refs for scrolling.
 * Does not focus the first host descendant.
 */ function InnerScrollHandler(props) {
    const childrenRef = _react.default.useRef(null);
    (0, _react.useLayoutEffect)(()=>{
        const { scrollRef: scrollHandlerRef, renderTree } = props;
        const scrollRef = scrollHandlerRef.forceScroll ? scrollHandlerRef.scrollRef : renderTree.data.scrollRef;
        if (scrollRef === null || !scrollRef.current) return;
        let instance = null;
        const hashFragment = scrollHandlerRef.hashFragment;
        if (hashFragment) {
            instance = getHashFragmentDomNode(hashFragment);
            if (instance === null) {
                // A missing hash target is still a handled scroll intent. Do not
                // fall back to the route Fragment or leave the intent pending.
                scrollRef.current = false;
                scrollHandlerRef.onlyHashChange = false;
                scrollHandlerRef.hashFragment = null;
                return;
            }
        } else {
            instance = childrenRef.current;
        }
        // If there is no DOM node this layout-router level is skipped. It'll be handled higher-up in the tree.
        if (instance === null) {
            return;
        }
        let didHandleScroll = false;
        (0, _disablesmoothscroll.disableSmoothScrollDuringRouteTransition)(()=>{
            const htmlElement = document.documentElement;
            let viewportHeight = null;
            let initialTargetState = null;
            let scrollPaddingTop = null;
            const getScrollPaddingTop = ()=>{
                if (scrollPaddingTop === null) {
                    // Reuse the style and layout update from the geometry read.
                    scrollPaddingTop = getScrollPaddingTopInPixels(htmlElement, viewportHeight);
                }
                return scrollPaddingTop;
            };
            if (!hashFragment) {
                // Store the current viewport height because reading `clientHeight` causes a reflow,
                // and it won't change during this function.
                viewportHeight = htmlElement.clientHeight;
                initialTargetState = getScrollTargetState(instance, viewportHeight, getScrollPaddingTop);
                // An empty Fragment is not a scroll target. In particular, avoid
                // React's sibling fallback and leave the scroll signal available
                // for another changed segment.
                if (initialTargetState === 0) {
                    return;
                }
            }
            didHandleScroll = true;
            // Mark as scrolled so no other segment scrolls for this navigation.
            scrollRef.current = false;
            // This handler intentionally leaves focus untouched; resetting focus on
            // navigation is deferred.
            // In case of hash scroll, we only need to scroll the element into view
            if (hashFragment) {
                instance.scrollIntoView();
                return;
            }
            // If the element's top edge is already in the viewport, exit early.
            if (initialTargetState === 1) {
                return;
            }
            // Otherwise, try scrolling go the top of the document to be backward compatible with pages
            // scrollIntoView() called on `<html/>` element scrolls horizontally on chrome and firefox (that shouldn't happen)
            // We could use it to scroll horizontally following RTL but that also seems to be broken - it will always scroll left
            // scrollLeft = 0 also seems to ignore RTL and manually checking for RTL is too much hassle so we will scroll just vertically
            htmlElement.scrollTop = 0;
            // Scroll to domNode if domNode is not in viewport when scrolled to top of document
            if (getScrollTargetState(instance, viewportHeight, getScrollPaddingTop) === 2) {
                // Scroll into view doesn't scroll horizontally by default when not needed
                instance.scrollIntoView();
            }
        }, {
            // We will force layout by querying domNode position
            dontForceLayout: true,
            onlyHashChange: scrollHandlerRef.onlyHashChange
        });
        if (!didHandleScroll) {
            return;
        }
        // Mutate after scrolling so that it can be read by `disableSmoothScrollDuringRouteTransition`
        scrollHandlerRef.onlyHashChange = false;
        scrollHandlerRef.hashFragment = null;
    }, // but be prepared for lots of manual testing.
    undefined);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_react.Fragment, {
        ref: childrenRef,
        children: props.children
    });
}
function ScrollHandler({ children, renderTree }) {
    const context = (0, _react.useContext)(_approutercontextsharedruntime.GlobalLayoutRouterContext);
    if (!context) {
        throw new Error('invariant global layout router not mounted');
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(InnerScrollHandler, {
        scrollRef: context.scrollRef,
        renderTree: renderTree,
        children: children
    });
}
/**
 * InnerLayoutRouter handles rendering the provided segment based on the cache.
 */ function InnerLayoutRouter({ tree, segmentPath, debugNameContext, renderTree, params, url, isActive }) {
    const context = (0, _react.useContext)(_approutercontextsharedruntime.GlobalLayoutRouterContext);
    const parentNavPromises = (0, _react.useContext)(_hooksclientcontextsharedruntime.NavigationPromisesContext);
    if (!context) {
        throw new Error('invariant global layout router not mounted');
    }
    // `rsc` represents the renderable node for this segment.
    // If this segment has a `prefetchRsc`, it's the statically prefetched data.
    // We should use that on initial render instead of `rsc`. Then we'll switch
    // to `rsc` when the dynamic response streams in.
    //
    // If no prefetch data is available, then we go straight to rendering `rsc`.
    const resolvedPrefetchRsc = renderTree.data.prefetchRsc !== null ? renderTree.data.prefetchRsc : renderTree.data.rsc;
    // We use `useDeferredValue` to handle switching between the prefetched and
    // final values. The second argument is returned on initial render, then it
    // re-renders with the first argument.
    const rsc = (0, _react.useDeferredValue)(renderTree.data.rsc, resolvedPrefetchRsc);
    // `rsc` is either a React node or a promise for a React node, except we
    // special case `null` to represent that this segment's data is missing. If
    // it's a promise, we need to unwrap it so we can determine whether or not the
    // data is missing.
    let resolvedRsc;
    if ((0, _rendertree.isDeferredRsc)(rsc)) {
        const unwrappedRsc = (0, _react.use)(rsc);
        if (unwrappedRsc === null) {
            // If the promise was resolved to `null`, it means the data for this
            // segment was not returned by the server. Suspend indefinitely. When this
            // happens, the router is responsible for triggering a new state update to
            // un-suspend this segment.
            (0, _react.use)(_unresolvedthenable.unresolvedThenable);
        }
        resolvedRsc = unwrappedRsc;
    } else {
        // This is not a deferred RSC promise. Don't need to unwrap it.
        if (rsc === null) {
            (0, _react.use)(_unresolvedthenable.unresolvedThenable);
        }
        resolvedRsc = rsc;
    }
    // In dev, we create a NavigationPromisesContext containing the instrumented promises that provide
    // `useSelectedLayoutSegment` and `useSelectedLayoutSegments`.
    // Promises are cached outside of render to survive suspense retries.
    let navigationPromises = null;
    if ("TURBOPACK compile-time truthy", 1) {
        const { createNestedLayoutNavigationPromises } = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation-devtools.js [app-client] (ecmascript)");
        navigationPromises = createNestedLayoutNavigationPromises(tree, parentNavPromises);
    }
    let children = resolvedRsc;
    if (navigationPromises) {
        children = /*#__PURE__*/ (0, _jsxruntime.jsx)(_hooksclientcontextsharedruntime.NavigationPromisesContext.Provider, {
            value: navigationPromises,
            children: resolvedRsc
        });
    }
    children = /*#__PURE__*/ (0, _jsxruntime.jsx)(_approutercontextsharedruntime.LayoutRouterContext.Provider, {
        value: {
            parentTree: tree,
            parentRenderTree: renderTree,
            parentSegmentPath: segmentPath,
            parentParams: params,
            // This is always set to null as we enter a child segment. It's
            // populated by LoadingBoundaryProvider the next time we reach a
            // loading boundary.
            parentLoadingData: null,
            debugNameContext: debugNameContext,
            // TODO-APP: overriding of url for parallel routes
            url: url,
            isActive: isActive
        },
        children: children
    });
    return children;
}
function LoadingBoundaryProvider({ loading, children }) {
    // Provides the data needed to render a loading.tsx boundary, via context.
    //
    // loading.tsx creates a Suspense boundary around each of a layout's child
    // slots. (Might be bit confusing to think about the data flow, but: if
    // loading.tsx and layout.tsx are in the same directory, they are assigned
    // to the same render tree.)
    //
    // This provider component does not render the Suspense boundary directly;
    // that's handled by LoadingBoundary.
    //
    // TODO: For simplicity, we should combine this provider with LoadingBoundary
    // and render the Suspense boundary directly. The only real benefit of doing
    // it separately is so that when there are multiple parallel routes, we only
    // send the boundary data once, rather than once per child. But that's a
    // negligible benefit and can be achieved via caching instead.
    const parentContext = (0, _react.use)(_approutercontextsharedruntime.LayoutRouterContext);
    if (parentContext === null) {
        return children;
    }
    // All values except for parentLoadingData are the same as the parent context.
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_approutercontextsharedruntime.LayoutRouterContext.Provider, {
        value: {
            parentTree: parentContext.parentTree,
            parentRenderTree: parentContext.parentRenderTree,
            parentSegmentPath: parentContext.parentSegmentPath,
            parentParams: parentContext.parentParams,
            parentLoadingData: loading,
            debugNameContext: parentContext.debugNameContext,
            url: parentContext.url,
            isActive: parentContext.isActive
        },
        children: children
    });
}
/**
 * Renders suspense boundary with the provided "loading" property as the fallback.
 * If no loading property is provided it renders the children without a suspense boundary.
 */ function LoadingBoundary({ name, loading, children }) {
    // TODO: For LoadingBoundary, and the other built-in boundary types, don't
    // wrap in an extra function component if no user-defined boundary is
    // provided. In other words, inline this conditional wrapping logic into
    // the parent component. More efficient and keeps unnecessary junk out of
    // the component stack.
    if (loading !== null) {
        const loadingRsc = loading[0];
        const loadingStyles = loading[1];
        const loadingScripts = loading[2];
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(_react.Suspense, {
            name: name,
            fallback: /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
                children: [
                    loadingStyles,
                    loadingScripts,
                    loadingRsc
                ]
            }),
            children: children
        });
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: children
    });
}
function OuterLayoutRouter({ parallelRouterKey, error, errorStyles, errorScripts, templateStyles, templateScripts, template, notFound, forbidden, unauthorized, segmentViewBoundaries }) {
    const context = (0, _react.useContext)(_approutercontextsharedruntime.LayoutRouterContext);
    if (!context) {
        throw new Error('invariant expected layout router to be mounted');
    }
    const { parentTree, parentRenderTree, parentSegmentPath, parentParams, parentLoadingData, url, isActive, debugNameContext } = context;
    // Get the render tree for this segment by reading it from the parent segment's
    // child map.
    const parentTreeSegment = parentTree[0];
    const segmentPath = parentSegmentPath === null ? // the code. We should clean this up.
    [
        parallelRouterKey
    ] : parentSegmentPath.concat([
        parentTreeSegment,
        parallelRouterKey
    ]);
    // The "state" key of a segment is the one passed to React. In the browser it
    // represents the identity of the UI tree. Whenever the state key changes,
    // the tree is recreated and the state is reset. In the App Router model,
    // search params do not cause state to be lost, so two segments with the same
    // segment path but different search params should have the same state key.
    // On the server, the key describes the segment's structure instead, so it
    // stays the same when unknown params become known during HTML resume.
    //
    // Whether the data can be reused is tracked separately, by the segment
    // cache's vary paths.
    const activeTree = parentTree[1][parallelRouterKey];
    const activeRenderTree = parentRenderTree.slots?.get(parallelRouterKey);
    if (activeTree === undefined || activeRenderTree === undefined) {
        // Could not find a matching segment. The client tree is inconsistent with
        // the server tree. Suspend indefinitely; the router will have already
        // detected the inconsistency when handling the server response, and
        // triggered a refresh of the page to recover.
        (0, _react.use)(_unresolvedthenable.unresolvedThenable);
    }
    let maybeValidationBoundaryId = null;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const activeSegment = activeTree[0];
    const activeStateKey = (0, _createsegmentkey.createSegmentKey)(activeSegment);
    // At each level of the route tree, not only do we render the currently
    // active segment — we also render the last N segments that were active at
    // this level inside a hidden <Activity> boundary, to preserve their state
    // if or when the user navigates to them again.
    //
    // bfcacheEntry is a linked list of FlightRouterStates.
    let bfcacheEntry = (0, _bfcachestatemanager.useRouterBFCache)(activeTree, activeRenderTree, activeStateKey);
    let children = [];
    do {
        const tree = bfcacheEntry.tree;
        const renderTree = bfcacheEntry.renderTree;
        const stateKey = bfcacheEntry.stateKey;
        const segment = tree[0];
        /*
    - Error boundary
      - Only renders error boundary if error component is provided.
      - Rendered for each segment to ensure they have their own error state.
      - When gracefully degrade for bots, skip rendering error boundary.
    - Loading boundary
      - Only renders suspense boundary if loading components is provided.
      - Rendered for each segment to ensure they have their own loading state.
      - Passed to the router during rendering to ensure it can be immediately rendered when suspending on a Flight fetch.
  */ let segmentBoundaryTriggerNode = null;
        let segmentViewStateNode = null;
        if ("TURBOPACK compile-time truthy", 1) {
            const { SegmentBoundaryTriggerNode, SegmentViewStateNode } = __turbopack_context__.r("[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)");
            const pagePrefix = (0, _apppaths.normalizeAppPath)(url);
            segmentViewStateNode = /*#__PURE__*/ (0, _jsxruntime.jsx)(SegmentViewStateNode, {
                page: pagePrefix
            }, pagePrefix);
            segmentBoundaryTriggerNode = /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
                children: /*#__PURE__*/ (0, _jsxruntime.jsx)(SegmentBoundaryTriggerNode, {})
            });
        }
        let params = parentParams;
        if (Array.isArray(segment)) {
            // This segment contains a route param. Accumulate these as we traverse
            // down the router tree. The result represents the set of params that
            // the layout/page components are permitted to access below this point.
            const paramName = segment[0];
            const paramCacheKey = segment[1];
            const paramType = segment[2];
            const paramValue = (0, _routeparams.getParamValueFromCacheKey)(paramCacheKey, paramType);
            if (paramValue !== null) {
                params = {
                    ...parentParams,
                    [paramName]: paramValue
                };
            }
        }
        const debugName = getBoundaryDebugNameFromSegment(segment);
        // `debugNameContext` represents the nearest non-"virtual" parent segment.
        // `getBoundaryDebugNameFromSegment` returns undefined for virtual segments.
        // So if `debugName` is undefined, the context is passed through unchanged.
        const childDebugNameContext = debugName ?? debugNameContext;
        // In practical terms, clicking this name in the Suspense DevTools
        // should select the child slots of that layout.
        //
        // So the name we apply to the Activity boundary is actually based on
        // the nearest parent segments.
        //
        // We skip over "virtual" parents, i.e. ones inserted by Next.js that
        // don't correspond to application-defined code.
        const isVirtual = debugName === undefined;
        const debugNameToDisplay = isVirtual ? undefined : debugNameContext;
        let templateValue = /*#__PURE__*/ (0, _jsxruntime.jsxs)(ScrollHandler, {
            renderTree: renderTree,
            children: [
                /*#__PURE__*/ (0, _jsxruntime.jsx)(_errorboundary.ErrorBoundary, {
                    errorComponent: error,
                    errorStyles: errorStyles,
                    errorScripts: errorScripts,
                    children: /*#__PURE__*/ (0, _jsxruntime.jsx)(LoadingBoundary, {
                        name: debugNameToDisplay,
                        // TODO: The loading module data for a segment is stored on the
                        // parent, then applied to each of that parent segment's
                        // parallel route slots. In the simple case where there's only
                        // one parallel route (the `children` slot), this is no
                        // different from if the loading module data were stored on the
                        // child directly. But I'm not sure this actually makes sense
                        // when there are multiple parallel routes. It's not a huge
                        // issue because you always have the option to define a narrower
                        // loading boundary for a particular slot. But this sort of
                        // smells like an implementation accident to me.
                        loading: parentLoadingData,
                        children: /*#__PURE__*/ (0, _jsxruntime.jsx)(_errorboundary1.HTTPAccessFallbackBoundary, {
                            notFound: notFound,
                            forbidden: forbidden,
                            unauthorized: unauthorized,
                            children: /*#__PURE__*/ (0, _jsxruntime.jsxs)(_redirectboundary.RedirectBoundary, {
                                children: [
                                    /*#__PURE__*/ (0, _jsxruntime.jsx)(InnerLayoutRouter, {
                                        url: url,
                                        tree: tree,
                                        params: params,
                                        renderTree: renderTree,
                                        segmentPath: segmentPath,
                                        debugNameContext: childDebugNameContext,
                                        isActive: isActive && stateKey === activeStateKey
                                    }),
                                    segmentBoundaryTriggerNode
                                ]
                            })
                        })
                    })
                }),
                segmentViewStateNode
            ]
        });
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        let child = /*#__PURE__*/ (0, _jsxruntime.jsxs)(_approutercontextsharedruntime.TemplateContext.Provider, {
            value: templateValue,
            children: [
                templateStyles,
                templateScripts,
                template
            ]
        }, stateKey);
        if ("TURBOPACK compile-time truthy", 1) {
            const { SegmentStateProvider } = __turbopack_context__.r("[project]/node_modules/next/dist/next-devtools/userspace/app/segment-explorer-node.js [app-client] (ecmascript)");
            child = /*#__PURE__*/ (0, _jsxruntime.jsxs)(SegmentStateProvider, {
                children: [
                    child,
                    segmentViewBoundaries
                ]
            }, stateKey);
        }
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        children.push(child);
        bfcacheEntry = bfcacheEntry.next;
    }while (bfcacheEntry !== null)
    return children;
}
function getBoundaryDebugNameFromSegment(segment) {
    if (segment === '/') {
        // Reached the root
        return '/';
    }
    if (typeof segment === 'string') {
        if (isVirtualLayout(segment)) {
            return undefined;
        } else {
            return segment + '/';
        }
    }
    const paramCacheKey = segment[1];
    return paramCacheKey + '/';
}
function isVirtualLayout(segment) {
    return(// (like __PAGE__ and __DEFAULT__) to avoid collisions with
    // user-defined route groups.
    segment === '(__SLOT__)');
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/components/render-from-template-context.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return RenderFromTemplateContext;
    }
});
const _interop_require_wildcard = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_wildcard.cjs [app-client] (ecmascript)");
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = /*#__PURE__*/ _interop_require_wildcard._(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"));
const _approutercontextsharedruntime = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js [app-client] (ecmascript)");
function RenderFromTemplateContext() {
    const children = (0, _react.useContext)(_approutercontextsharedruntime.TemplateContext);
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: children
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/request/params.browser.dev.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderParamsFromClient;
    }
});
const _reflect = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)");
const _reflectutils = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)");
const CachedParams = new WeakMap();
function makeDynamicallyTrackedParamsWithDevWarnings(underlyingParams) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    const promise = Promise.resolve(underlyingParams);
    const proxiedProperties = new Set();
    Object.keys(underlyingParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (proxiedProperties.has(prop)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('params', prop);
                    warnForSyncAccess(expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return _reflect.ReflectAdapter.set(target, prop, value, receiver);
        },
        ownKeys (target) {
            warnForEnumeration();
            return Reflect.ownKeys(target);
        }
    });
    proxiedPromise.status = 'fulfilled';
    proxiedPromise.value = underlyingParams;
    CachedParams.set(underlyingParams, proxiedPromise);
    return proxiedPromise;
}
function warnForSyncAccess(expression) {
    console.error(`A param property was accessed directly with ${expression}. ` + `\`params\` is a Promise and must be unwrapped with \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`);
}
function warnForEnumeration() {
    console.error(`params are being enumerated. ` + `\`params\` is a Promise and must be unwrapped with \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`);
}
function createRenderParamsFromClient(clientParams) {
    return makeDynamicallyTrackedParamsWithDevWarnings(clientParams);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/request/params.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderParamsFromClient;
    }
});
const createRenderParamsFromClient = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/node_modules/next/dist/client/request/params.browser.dev.js [app-client] (ecmascript)").createRenderParamsFromClient : "TURBOPACK unreachable";
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/request/search-params.browser.dev.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderSearchParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderSearchParamsFromClient;
    }
});
const _reflect = __turbopack_context__.r("[project]/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)");
const _reflectutils = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)");
const CachedSearchParams = new WeakMap();
function makeUntrackedSearchParamsWithDevWarnings(underlyingSearchParams) {
    const cachedSearchParams = CachedSearchParams.get(underlyingSearchParams);
    if (cachedSearchParams) {
        return cachedSearchParams;
    }
    const proxiedProperties = new Set();
    const promise = Promise.resolve(underlyingSearchParams);
    Object.keys(underlyingSearchParams).forEach((prop)=>{
        if (_reflectutils.wellKnownProperties.has(prop)) {
        // These properties cannot be shadowed because they need to be the
        // true underlying value for Promises to work correctly at runtime
        } else {
            proxiedProperties.add(prop);
        }
    });
    const proxiedPromise = new Proxy(promise, {
        get (target, prop, receiver) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeStringPropertyAccess)('searchParams', prop);
                    warnForSyncAccess(expression);
                }
            }
            return _reflect.ReflectAdapter.get(target, prop, receiver);
        },
        set (target, prop, value, receiver) {
            if (typeof prop === 'string') {
                proxiedProperties.delete(prop);
            }
            return Reflect.set(target, prop, value, receiver);
        },
        has (target, prop) {
            if (typeof prop === 'string') {
                if (!_reflectutils.wellKnownProperties.has(prop) && (proxiedProperties.has(prop) || // We are accessing a property that doesn't exist on the promise nor
                // the underlying searchParams.
                Reflect.has(target, prop) === false)) {
                    const expression = (0, _reflectutils.describeHasCheckingStringProperty)('searchParams', prop);
                    warnForSyncAccess(expression);
                }
            }
            return Reflect.has(target, prop);
        },
        ownKeys (target) {
            warnForSyncSpread();
            return Reflect.ownKeys(target);
        }
    });
    proxiedPromise.status = 'fulfilled';
    proxiedPromise.value = underlyingSearchParams;
    CachedSearchParams.set(underlyingSearchParams, proxiedPromise);
    return proxiedPromise;
}
function warnForSyncAccess(expression) {
    console.error(`A searchParam property was accessed directly with ${expression}. ` + `\`searchParams\` is a Promise and must be unwrapped with \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`);
}
function warnForSyncSpread() {
    console.error(`The keys of \`searchParams\` were accessed directly. ` + `\`searchParams\` is a Promise and must be unwrapped with \`React.use()\` before accessing its properties. ` + `Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`);
}
function createRenderSearchParamsFromClient(underlyingSearchParams) {
    return makeUntrackedSearchParamsWithDevWarnings(underlyingSearchParams);
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/client/request/search-params.browser.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "createRenderSearchParamsFromClient", {
    enumerable: true,
    get: function() {
        return createRenderSearchParamsFromClient;
    }
});
const createRenderSearchParamsFromClient = ("TURBOPACK compile-time truthy", 1) ? __turbopack_context__.r("[project]/node_modules/next/dist/client/request/search-params.browser.dev.js [app-client] (ecmascript)").createRenderSearchParamsFromClient : "TURBOPACK unreachable";
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/node_modules/next/dist/lib/metadata/generate/icon-mark.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "IconMark", {
    enumerable: true,
    get: function() {
        return IconMark;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const IconMark = ()=>{
    if (typeof window !== 'undefined') {
        return null;
    }
    return /*#__PURE__*/ (0, _jsxruntime.jsx)("meta", {
        name: "\xabnxt-icon\xbb"
    });
};
}),
"[project]/node_modules/next/dist/server/web/spec-extension/adapters/reflect.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "ReflectAdapter", {
    enumerable: true,
    get: function() {
        return ReflectAdapter;
    }
});
class ReflectAdapter {
    static get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (typeof value === 'function') {
            return value.bind(target);
        }
        return value;
    }
    static set(target, prop, value, receiver) {
        return Reflect.set(target, prop, value, receiver);
    }
    static has(target, prop) {
        return Reflect.has(target, prop);
    }
    static deleteProperty(target, prop) {
        return Reflect.deleteProperty(target, prop);
    }
}
}),
"[project]/node_modules/next/dist/shared/lib/router/utils/disable-smooth-scroll.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * Run function with `scroll-behavior: auto` applied to `<html/>`.
 * This css change will be reverted after the function finishes.
 */ "use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "disableSmoothScrollDuringRouteTransition", {
    enumerable: true,
    get: function() {
        return disableSmoothScrollDuringRouteTransition;
    }
});
function disableSmoothScrollDuringRouteTransition(fn, options = {}) {
    // if only the hash is changed, we don't need to disable smooth scrolling
    // we only care to prevent smooth scrolling when navigating to a new page to avoid jarring UX
    if (options.onlyHashChange) {
        fn();
        return;
    }
    const htmlElement = document.documentElement;
    const hasDataAttribute = htmlElement.dataset.scrollBehavior === 'smooth';
    if (!hasDataAttribute) {
        // Warn if smooth scrolling is detected but no data attribute is present
        if (("TURBOPACK compile-time value", "development") === 'development' && getComputedStyle(htmlElement).scrollBehavior === 'smooth') {
            const { warnOnce } = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/utils/warn-once.js [app-client] (ecmascript)");
            warnOnce('Detected `scroll-behavior: smooth` on the `<html>` element. To disable smooth scrolling during route transitions, ' + 'add `data-scroll-behavior="smooth"` to your <html> element. ' + 'Learn more: https://nextjs.org/docs/messages/missing-data-scroll-behavior');
        }
        // No smooth scrolling configured, run directly without style manipulation
        fn();
        return;
    }
    // Proceed with temporarily disabling smooth scrolling
    const existing = htmlElement.style.scrollBehavior;
    htmlElement.style.scrollBehavior = 'auto';
    if (!options.dontForceLayout) {
        // In Chrome-based browsers we need to force reflow before calling `scrollTo`.
        // Otherwise it will not pickup the change in scrollBehavior
        // More info here: https://github.com/vercel/next.js/issues/40719#issuecomment-1336248042
        htmlElement.getClientRects();
    }
    fn();
    htmlElement.style.scrollBehavior = existing;
}
}),
"[project]/node_modules/next/dist/shared/lib/utils/reflect-utils.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This regex will have fast negatives meaning valid identifiers may not pass
// this test. However this is only used during static generation to provide hints
// about why a page bailed out of some or all prerendering and we can use bracket notation
// for example while `ಠ_ಠ` is a valid identifier it's ok to print `searchParams['ಠ_ಠ']`
// even if this would have been fine too `searchParams.ಠ_ಠ`
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    describeHasCheckingStringProperty: null,
    describeStringPropertyAccess: null,
    wellKnownProperties: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    describeHasCheckingStringProperty: function() {
        return describeHasCheckingStringProperty;
    },
    describeStringPropertyAccess: function() {
        return describeStringPropertyAccess;
    },
    wellKnownProperties: function() {
        return wellKnownProperties;
    }
});
const isDefinitelyAValidIdentifier = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function describeStringPropertyAccess(target, prop) {
    if (isDefinitelyAValidIdentifier.test(prop)) {
        return `\`${target}.${prop}\``;
    }
    return `\`${target}[${JSON.stringify(prop)}]\``;
}
function describeHasCheckingStringProperty(target, prop) {
    const stringifiedProp = JSON.stringify(prop);
    return `\`Reflect.has(${target}, ${stringifiedProp})\`, \`${stringifiedProp} in ${target}\`, or similar`;
}
const wellKnownProperties = new Set([
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    'toLocaleString',
    // Promise prototype
    'then',
    'catch',
    'finally',
    // React Promise extension
    'status',
    // 'value',
    // 'error',
    // React introspection
    'displayName',
    '_debugInfo',
    // Common tested properties
    'toJSON',
    '$$typeof',
    '__esModule',
    // Tested by flight when checking for iterables
    '@@iterator'
]);
}),
"[project]/src/components/common/AosInitializer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AosInitializer",
    ()=>AosInitializer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
const AosInitializer = ()=>{
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AosInitializer.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                __turbopack_context__.A("[project]/node_modules/aos/dist/aos.js [app-client] (ecmascript, async loader)").then({
                    "AosInitializer.useEffect": (AOS)=>{
                        AOS.default.init({
                            duration: 800,
                            easing: 'ease-out-cubic',
                            once: true,
                            offset: 50
                        });
                        AOS.default.refresh();
                    }
                }["AosInitializer.useEffect"]);
            }
        }
    }["AosInitializer.useEffect"], []);
    return null;
};
_s(AosInitializer, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = AosInitializer;
var _c;
__turbopack_context__.k.register(_c, "AosInitializer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/ShopContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ShopProvider",
    ()=>ShopProvider,
    "useShop",
    ()=>useShop
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/products.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/adminInitialData.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const ShopContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ShopProvider = ({ children })=>{
    _s();
    // Live Products State (initialized with default products catalog)
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ShopProvider.useState": ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"].map({
                "ShopProvider.useState": (p, idx)=>({
                        ...p,
                        stockCount: p.inStock ? 25 + idx * 5 : 0,
                        sku: `RSH-FSH-${1000 + idx}`,
                        brand: p.category.includes('Casual') ? 'Reshans Casuals' : p.category.includes('Men') ? 'Reshans Atelier' : 'Reshans Studio'
                    })
            }["ShopProvider.useState"])
    }["ShopProvider.useState"]);
    // Admin orders, customers, categories, brands, coupons, reviews, banners, settings, admin profile
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ShopProvider.useState": ()=>{
            try {
                const saved = localStorage.getItem('reshans_orders_v1');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                }
            } catch  {
            // fallback to initial orders
            }
            return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_ORDERS"];
        }
    }["ShopProvider.useState"]);
    const [customers, setCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_CUSTOMERS"]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_CATEGORIES"]);
    const [brands, setBrands] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_BRANDS"]);
    const [coupons, setCoupons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_COUPONS"]);
    const [reviews, setReviews] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_REVIEWS"]);
    const [banners, setBanners] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_BANNERS"]);
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_SETTINGS"]);
    const [adminProfile, setAdminProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$adminInitialData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["INITIAL_ADMIN_PROFILE"]);
    // Pre-seed cart with 2 default items in BDT (or restore from localStorage)
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "ShopProvider.useState": ()=>{
            try {
                const saved = localStorage.getItem('reshans_cart_v1');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed)) return parsed;
                }
            } catch  {
            // fallback to seeded items
            }
            return [
                {
                    product: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][0],
                    quantity: 1,
                    selectedColor: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][0].colors[0]?.name || 'Forest Green',
                    selectedSize: 'M'
                },
                {
                    product: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][8],
                    quantity: 1,
                    selectedColor: 'Tangerine',
                    selectedSize: 'M'
                }
            ];
        }
    }["ShopProvider.useState"]);
    // Checkout, Buy Now, Coupon & Order Confirmation state
    const [checkoutMode, setCheckoutMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('cart');
    const [buyNowItem, setBuyNowItem] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [appliedCouponCode, setAppliedCouponCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [orderNote, setOrderNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [lastConfirmedOrder, setLastConfirmedOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [trackedCodeQuery, setTrackedCodeQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopProvider.useEffect": ()=>{
            try {
                localStorage.setItem('reshans_cart_v1', JSON.stringify(cart));
            } catch  {
            // ignore storage quota errors
            }
        }
    }["ShopProvider.useEffect"], [
        cart
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopProvider.useEffect": ()=>{
            try {
                localStorage.setItem('reshans_orders_v1', JSON.stringify(orders));
            } catch  {
            // ignore storage quota errors
            }
        }
    }["ShopProvider.useEffect"], [
        orders
    ]);
    const [wishlist, setWishlist] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        'prod-2',
        'prod-5'
    ]);
    const [quickViewProduct, setQuickViewProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCartOpen, setIsCartOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isWishlistOpen, setIsWishlistOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSearchOpen, setIsSearchOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isOffcanvasOpen, setIsOffcanvasOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isAuthOpen, setIsAuthOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [toastMessage, setToastMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Routing state based on real browser pathname (HTML5 History API)
    const getInitialPath = ()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        const pathname = window.location.pathname;
        if (pathname && pathname !== '/') return pathname;
        return '/';
    };
    const [currentPath, setCurrentPath] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(getInitialPath);
    const [activeCategoryFilter, setActiveCategoryFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('all');
    const navigate = (path)=>{
        const normalized = path.startsWith('/') ? path : `/${path}`;
        setCurrentPath(normalized);
        if ("TURBOPACK compile-time truthy", 1) {
            // Use standard pushState so URL bar shows real pathname without '#'
            if (window.location.pathname !== normalized) {
                window.history.pushState({}, '', normalized);
            }
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };
    const navigateToCategory = (category)=>{
        setActiveCategoryFilter(category);
        navigate('/shop');
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopProvider.useEffect": ()=>{
            const handleLocationChange = {
                "ShopProvider.useEffect.handleLocationChange": ()=>{
                    const pathname = window.location.pathname;
                    const target = pathname && pathname !== '/' ? pathname : '/';
                    setCurrentPath(target);
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            }["ShopProvider.useEffect.handleLocationChange"];
            window.addEventListener('popstate', handleLocationChange);
            return ({
                "ShopProvider.useEffect": ()=>{
                    window.removeEventListener('popstate', handleLocationChange);
                }
            })["ShopProvider.useEffect"];
        }
    }["ShopProvider.useEffect"], []);
    const clearToast = ()=>setToastMessage(null);
    const showToast = (msg)=>{
        setToastMessage(msg);
        setTimeout(()=>{
            setToastMessage((curr)=>curr === msg ? null : curr);
        }, 3500);
    };
    // 1/ Prevent background scrolling whenever ANY modal/drawer is open
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopProvider.useEffect": ()=>{
            const isAnyModalOpen = isAuthOpen || isCartOpen || isWishlistOpen || isSearchOpen || isOffcanvasOpen || !!quickViewProduct;
            if (isAnyModalOpen) {
                document.body.style.overflow = 'hidden';
                document.body.style.touchAction = 'none';
            } else {
                document.body.style.overflow = '';
                document.body.style.touchAction = '';
            }
            return ({
                "ShopProvider.useEffect": ()=>{
                    document.body.style.overflow = '';
                    document.body.style.touchAction = '';
                }
            })["ShopProvider.useEffect"];
        }
    }["ShopProvider.useEffect"], [
        isAuthOpen,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        isOffcanvasOpen,
        quickViewProduct
    ]);
    const addToCart = (product, quantity = 1, selectedColor, selectedSize, options)=>{
        const resolvedColor = selectedColor || product.colors[0]?.name || 'Default';
        const resolvedSize = selectedSize || product.sizes[0] || 'M';
        const shouldOpenDrawer = options?.openDrawer !== undefined ? options.openDrawer : true;
        setCart((prev)=>{
            const existingIndex = prev.findIndex((item)=>item.product.id === product.id && (item.selectedColor || 'Default') === resolvedColor && (item.selectedSize || 'M') === resolvedSize);
            if (existingIndex > -1) {
                const next = [
                    ...prev
                ];
                next[existingIndex] = {
                    ...next[existingIndex],
                    quantity: next[existingIndex].quantity + quantity
                };
                return next;
            } else {
                return [
                    ...prev,
                    {
                        product,
                        quantity,
                        selectedColor: resolvedColor,
                        selectedSize: resolvedSize
                    }
                ];
            }
        });
        showToast(`Added "${product.name}" to shopping bag!`);
        if (shouldOpenDrawer) {
            setIsCartOpen(true);
        }
    };
    const removeFromCart = (productId, selectedColor, selectedSize)=>{
        setCart((prev)=>prev.filter((item)=>{
                if (item.product.id !== productId) return true;
                if (selectedColor !== undefined && item.selectedColor !== selectedColor) return true;
                if (selectedSize !== undefined && item.selectedSize !== selectedSize) return true;
                return false;
            }));
    };
    const updateQuantity = (productId, quantity, selectedColor, selectedSize)=>{
        if (quantity <= 0) {
            removeFromCart(productId, selectedColor, selectedSize);
            return;
        }
        setCart((prev)=>prev.map((item)=>{
                const matchesId = item.product.id === productId;
                const matchesColor = selectedColor === undefined || item.selectedColor === selectedColor;
                const matchesSize = selectedSize === undefined || item.selectedSize === selectedSize;
                return matchesId && matchesColor && matchesSize ? {
                    ...item,
                    quantity
                } : item;
            }));
    };
    const clearCart = ()=>{
        setCart([]);
        setAppliedCouponCode(null);
    };
    const startBuyNow = (product, quantity, selectedColor, selectedSize)=>{
        const resolvedColor = selectedColor || product.colors[0]?.name || 'Default';
        const resolvedSize = selectedSize || product.sizes[0] || 'M';
        setBuyNowItem({
            product,
            quantity: Math.max(1, quantity),
            selectedColor: resolvedColor,
            selectedSize: resolvedSize
        });
        setCheckoutMode('buy-now');
        closeCart();
        closeQuickView();
        navigate('/checkout');
    };
    const clearBuyNow = ()=>{
        setBuyNowItem(null);
        setCheckoutMode('cart');
    };
    const proceedToCartCheckout = ()=>{
        setBuyNowItem(null);
        setCheckoutMode('cart');
        closeCart();
        navigate('/checkout');
    };
    const calculateDiscount = (subtotal, code = appliedCouponCode)=>{
        if (!code || subtotal <= 0) return 0;
        const normalized = code.trim().toUpperCase();
        const found = coupons.find((c)=>c.code.toUpperCase() === normalized && c.isActive);
        if (!found || subtotal < found.minSpend) return 0;
        if (found.discountType === 'percentage') {
            return Math.round(subtotal * found.discountValue / 100);
        }
        return Math.min(subtotal, found.discountValue);
    };
    const applyCouponCode = (rawCode, subtotal)=>{
        const code = rawCode.trim().toUpperCase();
        if (!code) {
            return {
                success: false,
                message: 'Please enter a promo code.',
                discountAmount: 0
            };
        }
        const found = coupons.find((c)=>c.code.toUpperCase() === code && c.isActive);
        if (!found) {
            return {
                success: false,
                message: `Promo code "${code}" is invalid or expired.`,
                discountAmount: 0
            };
        }
        if (subtotal < found.minSpend) {
            return {
                success: false,
                message: `Minimum spend of ৳ ${found.minSpend.toLocaleString('en-US')} required for ${found.code}.`,
                discountAmount: 0
            };
        }
        const discountAmount = found.discountType === 'percentage' ? Math.round(subtotal * found.discountValue / 100) : Math.min(subtotal, found.discountValue);
        setAppliedCouponCode(found.code);
        showToast(`Promo code ${found.code} applied!`);
        return {
            success: true,
            message: `${found.code} applied (${found.discountType === 'percentage' ? `${found.discountValue}% off` : `৳ ${found.discountValue} off`})`,
            discountAmount
        };
    };
    const removeCouponCode = ()=>{
        setAppliedCouponCode(null);
    };
    const placeOrder = (payload)=>{
        const now = new Date();
        const pad = (n)=>n.toString().padStart(2, '0');
        const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
        const randomOrderNum = Math.floor(1000 + Math.random() * 9000);
        const randomTrackSuffix = `${Math.floor(100000 + Math.random() * 900000)}`;
        const orderId = `ORD-${randomOrderNum}`;
        const trackingCode = `RSH-${now.getFullYear()}-${randomTrackSuffix}`;
        const fullAddress = [
            payload.customerAddress,
            payload.area,
            payload.city,
            payload.postalCode
        ].filter(Boolean).join(', ');
        const newOrder = {
            id: orderId,
            customerName: payload.customerName,
            customerEmail: payload.customerEmail,
            customerPhone: payload.customerPhone,
            customerAddress: fullAddress,
            city: payload.city,
            area: payload.area,
            postalCode: payload.postalCode,
            shippingZone: payload.shippingZone,
            date: dateStr,
            items: payload.items.map((item)=>({
                    product: item.product,
                    quantity: item.quantity,
                    selectedColor: item.selectedColor,
                    selectedSize: item.selectedSize
                })),
            subtotal: payload.subtotal,
            shippingCost: payload.shippingCost,
            discount: payload.discount,
            couponCode: payload.couponCode,
            total: payload.total,
            paymentMethod: payload.paymentMethod,
            paymentStatus: payload.paymentMethod === 'bKash' ? 'Paid' : 'Pending',
            orderStatus: payload.paymentMethod === 'bKash' ? 'Processing' : 'Pending',
            trackingNumber: trackingCode,
            bkashNumber: payload.bkashNumber,
            bkashTransactionId: payload.bkashTransactionId,
            note: payload.note
        };
        setOrders((prev)=>[
                newOrder,
                ...prev
            ]);
        setLastConfirmedOrder(newOrder);
        setTrackedCodeQuery(trackingCode);
        if (payload.mode === 'buy-now') {
            setBuyNowItem(null);
            setCheckoutMode('cart');
        } else {
            setCart([]);
            setAppliedCouponCode(null);
            setOrderNote('');
        }
        showToast(`Order ${orderId} confirmed! Tracking Code: ${trackingCode}`);
        navigate('/order-confirmation');
        return newOrder;
    };
    const findOrderByTrackingCode = (query)=>{
        const clean = query.trim().replace(/^#/, '').toLowerCase();
        if (!clean) return undefined;
        return orders.find((ord)=>ord.trackingNumber && ord.trackingNumber.toLowerCase() === clean || ord.id.replace(/^#/, '').toLowerCase() === clean);
    };
    const toggleWishlist = (productId)=>{
        setWishlist((prev)=>{
            const exists = prev.includes(productId);
            const product = products.find((p)=>p.id === productId) || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"].find((p)=>p.id === productId);
            const name = product ? product.name : 'Item';
            if (exists) {
                showToast(`Removed "${name}" from wishlist`);
                return prev.filter((id)=>id !== productId);
            } else {
                showToast(`Saved "${name}" to wishlist ❤️`);
                return [
                    ...prev,
                    productId
                ];
            }
        });
    };
    const isInWishlist = (productId)=>wishlist.includes(productId);
    const openQuickView = (product)=>setQuickViewProduct(product);
    const closeQuickView = ()=>setQuickViewProduct(null);
    const openCart = ()=>setIsCartOpen(true);
    const closeCart = ()=>setIsCartOpen(false);
    const openWishlist = ()=>setIsWishlistOpen(true);
    const closeWishlist = ()=>setIsWishlistOpen(false);
    const openSearch = ()=>setIsSearchOpen(true);
    const closeSearch = ()=>setIsSearchOpen(false);
    const openOffcanvas = ()=>setIsOffcanvasOpen(true);
    const closeOffcanvas = ()=>setIsOffcanvasOpen(false);
    const openAuth = ()=>setIsAuthOpen(true);
    const closeAuth = ()=>setIsAuthOpen(false);
    const moveToCart = (productId, selectedColor, selectedSize)=>{
        const product = products.find((p)=>p.id === productId) || __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"].find((p)=>p.id === productId);
        if (product) {
            addToCart(product, 1, selectedColor, selectedSize);
            // Remove from wishlist once added to cart
            setWishlist((prev)=>prev.filter((id)=>id !== productId));
            showToast(`Moved "${product.name}" from wishlist to your shopping bag!`);
        }
    };
    const clearWishlist = ()=>{
        setWishlist([]);
        showToast('Wishlist cleared');
    };
    const cartTotal = cart.reduce((sum, item)=>sum + item.product.price * item.quantity, 0);
    const cartCount = cart.reduce((count, item)=>count + item.quantity, 0);
    const wishlistCount = wishlist.length;
    // BDT price formatter with ৳ symbol and comma separation
    const formatPrice = (amount)=>{
        return `৳ ${amount.toLocaleString('en-US')}`;
    };
    // Escape key closes modals
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ShopProvider.useEffect": ()=>{
            const handleKeyDown = {
                "ShopProvider.useEffect.handleKeyDown": (e)=>{
                    if (e.key === 'Escape') {
                        closeCart();
                        closeWishlist();
                        closeSearch();
                        closeOffcanvas();
                        closeQuickView();
                        closeAuth();
                    }
                }
            }["ShopProvider.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "ShopProvider.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["ShopProvider.useEffect"];
        }
    }["ShopProvider.useEffect"], []);
    // Admin Product Actions
    const addProduct = (newProdData)=>{
        const id = newProdData.id || `prod-${Date.now()}`;
        const newProduct = {
            ...newProdData,
            id,
            inStock: newProdData.inStock !== undefined ? newProdData.inStock : true,
            stockCount: newProdData.stockCount !== undefined ? newProdData.stockCount : 20,
            rating: newProdData.rating || 5,
            reviewsCount: newProdData.reviewsCount || 0,
            sizes: newProdData.sizes && newProdData.sizes.length ? newProdData.sizes : [
                'S',
                'M',
                'L',
                'XL'
            ],
            colors: newProdData.colors && newProdData.colors.length ? newProdData.colors : [
                {
                    name: 'Deep Forest',
                    hex: '#093624'
                }
            ]
        };
        setProducts((prev)=>[
                newProduct,
                ...prev
            ]);
        showToast(`Product "${newProduct.name}" created successfully!`);
    };
    const updateProduct = (id, updated)=>{
        setProducts((prev)=>prev.map((item)=>item.id === id ? {
                    ...item,
                    ...updated
                } : item));
        showToast(`Product updated successfully!`);
    };
    const deleteProduct = (id)=>{
        setProducts((prev)=>prev.filter((item)=>item.id !== id));
        showToast(`Product removed from catalog.`);
    };
    const updateStock = (id, inStock, stockCount)=>{
        setProducts((prev)=>prev.map((item)=>item.id === id ? {
                    ...item,
                    inStock,
                    stockCount: stockCount !== undefined ? stockCount : inStock ? 15 : 0
                } : item));
        showToast(`Stock status updated.`);
    };
    // Admin Order Actions
    const updateOrderStatus = (orderId, status)=>{
        setOrders((prev)=>prev.map((ord)=>ord.id === orderId ? {
                    ...ord,
                    orderStatus: status
                } : ord));
        showToast(`Order ${orderId} status changed to ${status}.`);
    };
    const cancelOrder = (orderId)=>{
        setOrders((prev)=>prev.map((ord)=>ord.id === orderId ? {
                    ...ord,
                    orderStatus: 'Cancelled'
                } : ord));
        showToast(`Order ${orderId} has been cancelled.`);
    };
    const refundOrder = (orderId)=>{
        setOrders((prev)=>prev.map((ord)=>ord.id === orderId ? {
                    ...ord,
                    paymentStatus: 'Refunded'
                } : ord));
        showToast(`Refund recorded for order ${orderId}.`);
    };
    // Admin Customer Actions
    const updateCustomerStatus = (id, status)=>{
        setCustomers((prev)=>prev.map((c)=>c.id === id ? {
                    ...c,
                    status
                } : c));
        showToast(`Customer status changed to ${status}.`);
    };
    // Admin Category & Brand Actions
    const addCategory = (cat)=>{
        const newCat = {
            ...cat,
            id: `CAT-${Date.now().toString().slice(-4)}`,
            itemCount: 0
        };
        setCategories((prev)=>[
                newCat,
                ...prev
            ]);
        showToast(`Category "${cat.name}" added successfully!`);
    };
    const updateCategory = (id, cat)=>{
        setCategories((prev)=>prev.map((c)=>c.id === id ? {
                    ...c,
                    ...cat
                } : c));
        showToast(`Category updated.`);
    };
    const deleteCategory = (id)=>{
        setCategories((prev)=>prev.filter((c)=>c.id !== id));
        showToast(`Category deleted.`);
    };
    const addBrand = (brand)=>{
        const newBrand = {
            ...brand,
            id: `BR-${Date.now().toString().slice(-4)}`,
            itemCount: 0
        };
        setBrands((prev)=>[
                newBrand,
                ...prev
            ]);
        showToast(`Brand "${brand.name}" added.`);
    };
    const deleteBrand = (id)=>{
        setBrands((prev)=>prev.filter((b)=>b.id !== id));
        showToast(`Brand deleted.`);
    };
    // Admin Coupons
    const addCoupon = (cpn)=>{
        const newCoupon = {
            ...cpn,
            id: `CPN-${Date.now().toString().slice(-4)}`,
            usageCount: 0
        };
        setCoupons((prev)=>[
                newCoupon,
                ...prev
            ]);
        showToast(`Coupon "${cpn.code}" activated!`);
    };
    const toggleCouponStatus = (id)=>{
        setCoupons((prev)=>prev.map((c)=>c.id === id ? {
                    ...c,
                    isActive: !c.isActive
                } : c));
        showToast(`Coupon status toggled.`);
    };
    const deleteCoupon = (id)=>{
        setCoupons((prev)=>prev.filter((c)=>c.id !== id));
        showToast(`Coupon deleted.`);
    };
    // Admin Reviews
    const approveReview = (id)=>{
        setReviews((prev)=>prev.map((r)=>r.id === id ? {
                    ...r,
                    status: 'approved'
                } : r));
        showToast(`Review approved and published!`);
    };
    const rejectReview = (id)=>{
        setReviews((prev)=>prev.map((r)=>r.id === id ? {
                    ...r,
                    status: 'rejected'
                } : r));
        showToast(`Review rejected.`);
    };
    const deleteReview = (id)=>{
        setReviews((prev)=>prev.filter((r)=>r.id !== id));
        showToast(`Review removed.`);
    };
    // Admin Banners
    const updateBanner = (id, updated)=>{
        setBanners((prev)=>prev.map((b)=>b.id === id ? {
                    ...b,
                    ...updated
                } : b));
        showToast(`Banner updated.`);
    };
    const toggleBanner = (id)=>{
        setBanners((prev)=>prev.map((b)=>b.id === id ? {
                    ...b,
                    isActive: !b.isActive
                } : b));
        showToast(`Banner visibility toggled.`);
    };
    // Admin Settings & Profile
    const updateSettings = (newSettings)=>{
        setSettings((prev)=>({
                ...prev,
                ...newSettings
            }));
        showToast(`Store settings saved!`);
    };
    const updateAdminProfile = (prof)=>{
        setAdminProfile((prev)=>({
                ...prev,
                ...prof
            }));
        showToast(`Admin profile updated.`);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShopContext.Provider, {
        value: {
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            updateStock,
            cart,
            wishlist,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            toggleWishlist,
            isInWishlist,
            quickViewProduct,
            openQuickView,
            closeQuickView,
            isCartOpen,
            openCart,
            closeCart,
            isWishlistOpen,
            openWishlist,
            closeWishlist,
            moveToCart,
            clearWishlist,
            isSearchOpen,
            openSearch,
            closeSearch,
            isOffcanvasOpen,
            openOffcanvas,
            closeOffcanvas,
            isAuthOpen,
            openAuth,
            closeAuth,
            cartTotal,
            cartCount,
            wishlistCount,
            toastMessage,
            clearToast,
            showToast,
            formatPrice,
            currentPath,
            navigate,
            activeCategoryFilter,
            setActiveCategoryFilter,
            navigateToCategory,
            checkoutMode,
            buyNowItem,
            startBuyNow,
            clearBuyNow,
            proceedToCartCheckout,
            appliedCouponCode,
            applyCouponCode,
            removeCouponCode,
            calculateDiscount,
            orderNote,
            setOrderNote,
            lastConfirmedOrder,
            trackedCodeQuery,
            setTrackedCodeQuery,
            placeOrder,
            findOrderByTrackingCode,
            // Admin State & Handlers
            orders,
            updateOrderStatus,
            cancelOrder,
            refundOrder,
            customers,
            updateCustomerStatus,
            categories,
            addCategory,
            updateCategory,
            deleteCategory,
            brands,
            addBrand,
            deleteBrand,
            coupons,
            addCoupon,
            toggleCouponStatus,
            deleteCoupon,
            reviews,
            approveReview,
            rejectReview,
            deleteReview,
            banners,
            updateBanner,
            toggleBanner,
            settings,
            updateSettings,
            adminProfile,
            updateAdminProfile
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/ShopContext.tsx",
        lineNumber: 827,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ShopProvider, "OGJBB5CGDMR8wd+oC0PcATGt4/0=");
_c = ShopProvider;
const useShop = ()=>{
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ShopContext);
    if (!context) {
        throw new Error('useShop must be used within a ShopProvider');
    }
    return context;
};
_s1(useShop, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ShopProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/adminInitialData.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "INITIAL_ADMIN_PROFILE",
    ()=>INITIAL_ADMIN_PROFILE,
    "INITIAL_BANNERS",
    ()=>INITIAL_BANNERS,
    "INITIAL_BRANDS",
    ()=>INITIAL_BRANDS,
    "INITIAL_CATEGORIES",
    ()=>INITIAL_CATEGORIES,
    "INITIAL_COUPONS",
    ()=>INITIAL_COUPONS,
    "INITIAL_CUSTOMERS",
    ()=>INITIAL_CUSTOMERS,
    "INITIAL_ORDERS",
    ()=>INITIAL_ORDERS,
    "INITIAL_REVIEWS",
    ()=>INITIAL_REVIEWS,
    "INITIAL_SETTINGS",
    ()=>INITIAL_SETTINGS
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/data/products.ts [app-client] (ecmascript)");
;
const INITIAL_ORDERS = [
    {
        id: 'ORD-8921',
        customerName: 'Floyd Miles',
        customerEmail: 'floyd.miles@example.com',
        customerPhone: '+880 1711 234 567',
        customerAddress: 'House 14, Road 7, Sector 3, Uttara, Dhaka-1230',
        date: '2026-03-28 14:32',
        items: [
            {
                product: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][0],
                quantity: 1,
                selectedColor: 'Forest Green',
                selectedSize: 'L'
            },
            {
                product: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][1],
                quantity: 1,
                selectedColor: 'Butter Cream',
                selectedSize: 'M'
            }
        ],
        total: 7450,
        paymentMethod: 'bKash',
        paymentStatus: 'Paid',
        orderStatus: 'Processing',
        trackingNumber: 'REDX-DH-98231',
        note: 'Please call before delivery'
    },
    {
        id: 'ORD-8920',
        customerName: 'Anika Rahman',
        customerEmail: 'anika.rahman@gmail.com',
        customerPhone: '+880 1822 456 789',
        customerAddress: 'Apartment 4B, Concord Tower, Gulshan-2, Dhaka',
        date: '2026-03-28 11:15',
        items: [
            {
                product: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][3],
                quantity: 1,
                selectedColor: 'Dark Pine',
                selectedSize: 'M'
            }
        ],
        total: 4950,
        paymentMethod: 'Credit / Debit Card',
        paymentStatus: 'Paid',
        orderStatus: 'Shipped',
        trackingNumber: 'STEAD-884129'
    },
    {
        id: 'ORD-8919',
        customerName: 'Tanvir Hossain',
        customerEmail: 'tanvir.hossain@outlook.com',
        customerPhone: '+880 1933 789 012',
        customerAddress: 'Plot 55, Road 8/A, Dhanmondi, Dhaka-1209',
        date: '2026-03-27 19:40',
        items: [
            {
                product: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][2],
                quantity: 2,
                selectedColor: 'Midnight',
                selectedSize: 'XL'
            },
            {
                product: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][8],
                quantity: 1,
                selectedColor: 'Tangerine',
                selectedSize: 'M'
            }
        ],
        total: 5850,
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        note: 'Leave package at security desk if unavailable'
    },
    {
        id: 'ORD-8918',
        customerName: 'Nusrat Jahan',
        customerEmail: 'nusrat.jahan@yahoo.com',
        customerPhone: '+880 1744 567 890',
        customerAddress: 'House 22, Nasirabad Housing Society, Chattogram',
        date: '2026-03-26 16:22',
        items: [
            {
                product: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][4],
                quantity: 1,
                selectedColor: 'Bone',
                selectedSize: 'S'
            }
        ],
        total: 6200,
        paymentMethod: 'Nagad',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        trackingNumber: 'PATHAO-CTG-3301'
    },
    {
        id: 'ORD-8917',
        customerName: 'Mahmudul Hasan',
        customerEmail: 'mahmud.hasan@gmail.com',
        customerPhone: '+880 1655 678 901',
        customerAddress: 'Zindabazar Road, Sylhet Sadar, Sylhet',
        date: '2026-03-25 10:05',
        items: [
            {
                product: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$data$2f$products$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PRODUCTS"][5],
                quantity: 1,
                selectedColor: 'Clay Terracotta',
                selectedSize: 'L'
            }
        ],
        total: 2150,
        paymentMethod: 'bKash',
        paymentStatus: 'Refunded',
        orderStatus: 'Cancelled',
        note: 'Customer requested size cancellation'
    }
];
const INITIAL_CUSTOMERS = [
    {
        id: 'CUST-101',
        name: 'Floyd Miles',
        email: 'floyd.miles@example.com',
        phone: '+880 1711 234 567',
        city: 'Dhaka',
        avatar: '/assets/img/others/dashboard-avater.jpg',
        joinedDate: 'Jan 12, 2025',
        totalOrders: 6,
        totalSpent: 28400,
        status: 'Active',
        lastActive: 'Just now'
    },
    {
        id: 'CUST-102',
        name: 'Anika Rahman',
        email: 'anika.rahman@gmail.com',
        phone: '+880 1822 456 789',
        city: 'Dhaka',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        joinedDate: 'Nov 04, 2025',
        totalOrders: 4,
        totalSpent: 19800,
        status: 'Active',
        lastActive: '3 hours ago'
    },
    {
        id: 'CUST-103',
        name: 'Tanvir Hossain',
        email: 'tanvir.hossain@outlook.com',
        phone: '+880 1933 789 012',
        city: 'Dhaka',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        joinedDate: 'Feb 18, 2026',
        totalOrders: 2,
        totalSpent: 9450,
        status: 'Active',
        lastActive: '1 day ago'
    },
    {
        id: 'CUST-104',
        name: 'Nusrat Jahan',
        email: 'nusrat.jahan@yahoo.com',
        phone: '+880 1744 567 890',
        city: 'Chattogram',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        joinedDate: 'Dec 22, 2025',
        totalOrders: 5,
        totalSpent: 31200,
        status: 'Active',
        lastActive: '2 days ago'
    },
    {
        id: 'CUST-105',
        name: 'Mahmudul Hasan',
        email: 'mahmud.hasan@gmail.com',
        phone: '+880 1655 678 901',
        city: 'Sylhet',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        joinedDate: 'Mar 01, 2026',
        totalOrders: 1,
        totalSpent: 2150,
        status: 'Blocked',
        lastActive: '3 days ago'
    }
];
const INITIAL_CATEGORIES = [
    {
        id: 'CAT-01',
        name: 'Men Collection',
        slug: 'men-collection',
        itemCount: 42,
        image: '/assets/img/fashion-1/category/category-1.jpg',
        description: 'Tailored shirts, structured trousers, linen suits and premium outerwear.',
        status: 'Active'
    },
    {
        id: 'CAT-02',
        name: 'Women Collection',
        slug: 'women-collection',
        itemCount: 56,
        image: '/assets/img/fashion-1/category/category-2.jpg',
        description: 'Chic silhouettes, artisanal silk blouses, evening gowns and essentials.',
        status: 'Active'
    },
    {
        id: 'CAT-03',
        name: 'Casual Wear',
        slug: 'casual-wear',
        itemCount: 38,
        image: '/assets/img/fashion-1/category/category-3.jpg',
        description: 'Everyday cotton tees, breathable knits, and relaxed weekend sets.',
        status: 'Active'
    },
    {
        id: 'CAT-04',
        name: 'Workleisure',
        slug: 'workleisure',
        itemCount: 29,
        image: '/assets/img/fashion-1/category/category-4.jpg',
        description: 'Blended formal-comfort wear engineered for modern professionals in Dhaka.',
        status: 'Active'
    },
    {
        id: 'CAT-05',
        name: 'Accessories & Bags',
        slug: 'accessories-bags',
        itemCount: 19,
        image: '/assets/img/fashion-1/category/category-5.jpg',
        description: 'Handcrafted leather wallets, canvas totes, belts, and caps.',
        status: 'Active'
    }
];
const INITIAL_BRANDS = [
    {
        id: 'BR-1',
        name: 'Reshans Atelier',
        itemCount: 34,
        origin: 'Dhaka, Bangladesh'
    },
    {
        id: 'BR-2',
        name: 'Reshans Studio',
        itemCount: 28,
        origin: 'Dhaka, Bangladesh'
    },
    {
        id: 'BR-3',
        name: 'Reshans Casuals',
        itemCount: 46,
        origin: 'Gazipur, Bangladesh'
    },
    {
        id: 'BR-4',
        name: 'Urban Silk Co.',
        itemCount: 18,
        origin: 'Rajshahi, Bangladesh'
    },
    {
        id: 'BR-5',
        name: 'Bengal Cotton Works',
        itemCount: 22,
        origin: 'Narayanganj, Bangladesh'
    }
];
const INITIAL_COUPONS = [
    {
        id: 'CPN-1',
        code: 'RESHANS20',
        discountType: 'percentage',
        discountValue: 20,
        minSpend: 3000,
        expiryDate: '2026-04-30',
        usageLimit: 200,
        usageCount: 84,
        isActive: true
    },
    {
        id: 'CPN-2',
        code: 'EID2026',
        discountType: 'percentage',
        discountValue: 25,
        minSpend: 5000,
        expiryDate: '2026-04-15',
        usageLimit: 500,
        usageCount: 192,
        isActive: true
    },
    {
        id: 'CPN-3',
        code: 'DHAKAFREE',
        discountType: 'fixed',
        discountValue: 120,
        minSpend: 2000,
        expiryDate: '2026-05-31',
        usageLimit: 300,
        usageCount: 110,
        isActive: true
    },
    {
        id: 'CPN-4',
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        minSpend: 1500,
        expiryDate: '2026-12-31',
        usageLimit: 1000,
        usageCount: 432,
        isActive: true
    }
];
const INITIAL_REVIEWS = [
    {
        id: 'REV-1',
        productId: 'prod-1',
        productName: 'Slim-Fit Crew in Cozy Waffle',
        productImage: '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
        customerName: 'Floyd Miles',
        customerAvatar: '/assets/img/others/dashboard-avater.jpg',
        rating: 5,
        comment: 'The waffle texture is supreme! Keeps warm during cool evenings in Gulshan and fits like a dream.',
        date: '2026-03-24',
        isVerified: true,
        status: 'approved'
    },
    {
        id: 'REV-2',
        productId: 'prod-2',
        productName: 'Sweater in Everyday Cotton',
        productImage: '/assets/img/fashion-1/product/product-2/front-img-1.jpg',
        customerName: 'Anika Rahman',
        rating: 5,
        comment: 'Butter cream shade looks luxurious in person. Soft combed cotton fabric with zero itching.',
        date: '2026-03-22',
        isVerified: true,
        status: 'approved'
    },
    {
        id: 'REV-3',
        productId: 'prod-3',
        productName: 'Fitted Waffle Texture Crew',
        productImage: '/assets/img/fashion-1/product/product-3/front-img-1.jpg',
        customerName: 'Tanvir Hossain',
        rating: 4,
        comment: 'Good fitting across shoulders, fabric breathability is great for Dhaka weather.',
        date: '2026-03-20',
        isVerified: true,
        status: 'approved'
    },
    {
        id: 'REV-4',
        productId: 'prod-4',
        productName: 'The Heavyweight Overshirt',
        productImage: '/assets/img/fashion-1/product/product-4/front-img-1.jpg',
        customerName: 'Zubair Ahmed',
        rating: 5,
        comment: 'Super heavy twill overshirt. Buttons are sturdy, pockets fit my phone effortlessly.',
        date: '2026-03-26',
        isVerified: true,
        status: 'pending'
    },
    {
        id: 'REV-5',
        productId: 'prod-7',
        productName: 'The Poplin Relaxed Shirt',
        productImage: '/assets/img/fashion-1/product/product-7/front-img-1.jpg',
        customerName: 'Sabbir Khan',
        rating: 3,
        comment: 'Color is slightly lighter than expected under indoor lighting.',
        date: '2026-03-25',
        isVerified: false,
        status: 'pending'
    }
];
const INITIAL_BANNERS = [
    {
        id: 'BAN-1',
        type: 'hero',
        title: 'Spring Summer 2026 Luxury Capsule',
        subtitle: 'Hand-dyed organic yarns & tailored contemporary silhouettes',
        buttonText: 'Explore Collection',
        link: '/shop',
        imageUrl: '/assets/img/fashion-1/slider/slider-1.jpg',
        isActive: true
    },
    {
        id: 'BAN-2',
        type: 'dual',
        title: 'The Linen Atelier Edition',
        subtitle: 'Up to 30% off tailored jackets',
        buttonText: 'Shop Linen',
        link: '/shop',
        imageUrl: '/assets/img/fashion-1/banner/banner-1.jpg',
        isActive: true
    },
    {
        id: 'BAN-3',
        type: 'dual',
        title: 'Minimalist Wardrobe Staples',
        subtitle: 'Combed organic cotton knitwear',
        buttonText: 'Discover Tops',
        link: '/shop',
        imageUrl: '/assets/img/fashion-1/banner/banner-2.jpg',
        isActive: true
    },
    {
        id: 'BAN-4',
        type: 'marquee',
        title: 'FREE EXPRESS SHIPPING ACROSS BANGLADESH ON ORDERS OVER ৳ 2,500',
        subtitle: 'USE CODE: EID2026 FOR 25% OFF',
        isActive: true
    }
];
const INITIAL_SETTINGS = {
    storeName: 'Reshans Fashion Atelier',
    tagline: 'Modern Bangladeshi Luxury & Contemporary Apparel',
    email: 'concierge@reshans.com',
    phone: '+880 1700 000 000',
    address: 'Level 4, House 42, Road 11, Block D, Banani, Dhaka-1213, Bangladesh',
    currency: 'BDT (৳)',
    shippingInsideDhaka: 60,
    shippingOutsideDhaka: 120,
    freeShippingThreshold: 2500,
    facebook: 'https://facebook.com/reshansbd',
    instagram: 'https://instagram.com/reshansfashion',
    youtube: 'https://youtube.com/@reshans',
    paymentCOD: true,
    paymentBkash: true,
    paymentNagad: true,
    paymentCards: true
};
const INITIAL_ADMIN_PROFILE = {
    name: 'Reshans Admin',
    email: 'admin@reshans.com',
    role: 'Super Administrator',
    avatar: '/assets/img/others/dashboard-avater.jpg',
    twoFactorEnabled: true,
    lastLogin: 'Today at 02:45 PM from Dhaka (IP: 103.230.104.12)'
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/data/products.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ARRIVALS_LOOKS",
    ()=>ARRIVALS_LOOKS,
    "CATEGORIES",
    ()=>CATEGORIES,
    "PRODUCTS",
    ()=>PRODUCTS,
    "SHOPGRAM_IMAGES",
    ()=>SHOPGRAM_IMAGES,
    "TESTIMONIALS",
    ()=>TESTIMONIALS
]);
const PRODUCTS = [
    {
        id: 'prod-1',
        name: 'Slim-Fit Crew in Cozy Waffle',
        category: 'Men Collection',
        price: 3850,
        originalPrice: 4800,
        discount: '-20%',
        badge: 'sale',
        rating: 5,
        reviewsCount: 32,
        frontImage: '/assets/img/fashion-1/product/product-1/front-img-1.jpg',
        backImage: '/assets/img/fashion-1/product/product-1/back-img-1.jpg',
        description: 'Designed with a textured waffle knit, this cozy crewneck sweater offers tailored warmth with everyday breathability.',
        sizes: [
            'S',
            'M',
            'L',
            'XL'
        ],
        colors: [
            {
                name: 'Forest Green',
                hex: '#093624',
                image: '/assets/img/fashion-1/product/product-1/front-img-1.jpg'
            },
            {
                name: 'Oatmeal',
                hex: '#D6C8B4',
                image: '/assets/img/fashion-1/product/product-1/front-img-2.jpg'
            },
            {
                name: 'Charcoal',
                hex: '#2C2E30',
                image: '/assets/img/fashion-1/product/product-1/front-img-3.jpg'
            }
        ],
        inStock: true,
        isTrending: true,
        isBestSeller: true,
        tabCategory: 'top_sellers',
        department: 'men'
    },
    {
        id: 'prod-2',
        name: 'Sweater in Everyday Cotton',
        category: 'Casual Wear',
        price: 3600,
        rating: 5,
        reviewsCount: 19,
        frontImage: '/assets/img/fashion-1/product/product-2/front-img-1.jpg',
        backImage: '/assets/img/fashion-1/product/product-2/back-img-1.jpg',
        description: '100% combed organic cotton sweater with ribbed trims and relaxed shoulders for effortless layering.',
        sizes: [
            'XS',
            'S',
            'M',
            'L'
        ],
        colors: [
            {
                name: 'Butter Cream',
                hex: '#F9F295',
                image: '/assets/img/fashion-1/product/product-2/front-img-1.jpg'
            },
            {
                name: 'Navy',
                hex: '#1B263B',
                image: '/assets/img/fashion-1/product/product-2/front-img-2.jpg'
            },
            {
                name: 'Rust',
                hex: '#8D493A',
                image: '/assets/img/fashion-1/product/product-2/front-img-3.jpg'
            }
        ],
        inStock: true,
        isTrending: true,
        isBestSeller: true,
        tabCategory: 'featured',
        department: 'women'
    },
    {
        id: 'prod-3',
        name: 'Fitted Waffle Texture Crew',
        category: 'Knitwear',
        price: 2450,
        originalPrice: 3200,
        discount: '-23%',
        badge: 'hot',
        rating: 4,
        reviewsCount: 45,
        frontImage: '/assets/img/fashion-1/product/product-3/front-img-1.jpg',
        backImage: '/assets/img/fashion-1/product/product-3/back-img-1.jpg',
        description: 'A versatile mid-weight waffle knit top crafted from responsibly sourced cotton yarns.',
        sizes: [
            'S',
            'M',
            'L',
            'XL',
            'XXL'
        ],
        colors: [
            {
                name: 'Sage Green',
                hex: '#7A8B7B',
                image: '/assets/img/fashion-1/product/product-3/front-img-1.jpg'
            },
            {
                name: 'Heather Gray',
                hex: '#A8A9AD',
                image: '/assets/img/fashion-1/product/product-3/front-img-2.jpg'
            },
            {
                name: 'Midnight',
                hex: '#0F172A',
                image: '/assets/img/fashion-1/product/product-3/front-img-3.jpg'
            }
        ],
        inStock: true,
        isTrending: true,
        isBestSeller: true,
        tabCategory: 'new',
        department: 'men'
    },
    {
        id: 'prod-4',
        name: 'The Heavyweight Overshirt',
        category: 'Outerwear',
        price: 4950,
        rating: 5,
        reviewsCount: 28,
        frontImage: '/assets/img/fashion-1/product/product-4/front-img-1.jpg',
        backImage: '/assets/img/fashion-1/product/product-4/back-img-1.jpg',
        description: 'Structured cotton twill jacket with utilitarian chest flap pockets and reinforced button seams.',
        sizes: [
            'M',
            'L',
            'XL'
        ],
        colors: [
            {
                name: 'Dark Pine',
                hex: '#093624',
                image: '/assets/img/fashion-1/product/product-4/front-img-1.jpg'
            },
            {
                name: 'Khaki',
                hex: '#C2B280',
                image: '/assets/img/fashion-1/product/product-4/front-img-2.jpg'
            },
            {
                name: 'Charcoal',
                hex: '#333333',
                image: '/assets/img/fashion-1/product/product-4/back-img-1.jpg'
            }
        ],
        inStock: true,
        isTrending: true,
        isBestSeller: true,
        tabCategory: 'top_sellers',
        department: 'men'
    },
    {
        id: 'prod-5',
        name: 'The Cocoon Crew in Alpaca',
        category: 'Luxury Knitwear',
        price: 1950,
        originalPrice: 2800,
        discount: '-30%',
        badge: 'sale',
        rating: 5,
        reviewsCount: 64,
        frontImage: '/assets/img/fashion-1/product/product-5/front-img-1.jpg',
        backImage: '/assets/img/fashion-1/product/product-5/back-img-1.jpg',
        description: 'Airy Peruvian alpaca blend sweater with a gentle boatneck cut and cloud-soft finish.',
        sizes: [
            'XS',
            'S',
            'M',
            'L'
        ],
        colors: [
            {
                name: 'Vanilla Cream',
                hex: '#F9F295',
                image: '/assets/img/fashion-1/product/product-5/front-img-1.jpg'
            },
            {
                name: 'Caramel',
                hex: '#A66E38',
                image: '/assets/img/fashion-1/product/product-5/front-img-2.jpg'
            },
            {
                name: 'Off-White',
                hex: '#F8F9FA',
                image: '/assets/img/fashion-1/product/product-5/front-img-3.jpg'
            }
        ],
        inStock: true,
        isTrending: true,
        isNewArrival: true,
        tabCategory: 'new',
        department: 'women'
    },
    {
        id: 'prod-6',
        name: 'Cozy Waffle Slim Crew Top',
        category: 'Essentials',
        price: 1850,
        originalPrice: 2600,
        discount: '-28%',
        badge: 'hot',
        rating: 4,
        reviewsCount: 52,
        frontImage: '/assets/img/fashion-1/product/product-6/front-img-1.jpg',
        backImage: '/assets/img/fashion-1/product/product-6/back-img-1.jpg',
        description: 'Ultra-soft micro waffle thermal top with ribbed cuffs and slim-fitting silhouette.',
        sizes: [
            'S',
            'M',
            'L'
        ],
        colors: [
            {
                name: 'Deep Olive',
                hex: '#093624',
                image: '/assets/img/fashion-1/product/product-6/front-img-1.jpg'
            },
            {
                name: 'Burgundy',
                hex: '#6B2D5C',
                image: '/assets/img/fashion-1/product/product-6/front-img-2.jpg'
            }
        ],
        inStock: true,
        isTrending: true,
        isNewArrival: true,
        tabCategory: 'new',
        department: 'women'
    },
    {
        id: 'prod-7',
        name: 'Polo Sweater in Cotton Merino',
        category: 'Smart Casual',
        price: 2950,
        rating: 5,
        reviewsCount: 17,
        frontImage: '/assets/img/fashion-1/product/product-7/front-img-1.jpg',
        backImage: '/assets/img/fashion-1/product/product-7/back-img-1.jpg',
        description: 'Fine-gauge merino wool polo knit with mother-of-pearl buttons and crisp collar styling.',
        sizes: [
            'M',
            'L',
            'XL'
        ],
        colors: [
            {
                name: 'Navy',
                hex: '#1A2A3A',
                image: '/assets/img/fashion-1/product/product-7/front-img-1.jpg'
            },
            {
                name: 'Ivory',
                hex: '#FFFFF0',
                image: '/assets/img/fashion-1/product/product-7/front-img-2.jpg'
            },
            {
                name: 'Sand',
                hex: '#D2B48C',
                image: '/assets/img/fashion-1/product/product-7/front-img-3.jpg'
            }
        ],
        inStock: true,
        isTrending: true,
        isNewArrival: true,
        tabCategory: 'featured',
        department: 'men'
    },
    {
        id: 'prod-8',
        name: 'The Essential Organic Crew',
        category: 'T-Shirts',
        price: 1450,
        badge: 'new',
        rating: 5,
        reviewsCount: 88,
        frontImage: '/assets/img/fashion-1/product/product-8/front-img-1.jpg',
        backImage: '/assets/img/fashion-1/product/product-8/back-img-1.jpg',
        description: 'Constructed from combed 180gsm organic jersey cotton with reinforced collar taped seams.',
        sizes: [
            'XS',
            'S',
            'M',
            'L',
            'XL'
        ],
        colors: [
            {
                name: 'Dark Green',
                hex: '#093624',
                image: '/assets/img/fashion-1/product/product-8/front-img-1.jpg'
            },
            {
                name: 'White',
                hex: '#FFFFFF',
                image: '/assets/img/fashion-1/product/product-8/front-img-2.jpg'
            },
            {
                name: 'Black',
                hex: '#111111',
                image: '/assets/img/fashion-1/product/product-8/front-img-3.jpg'
            }
        ],
        inStock: true,
        isTrending: true,
        isNewArrival: true,
        tabCategory: 'new',
        department: 'kids'
    },
    {
        id: 'prod-9',
        name: 'Ribbed Tank Top - Orange',
        category: 'Summer Tops',
        price: 950,
        originalPrice: 1400,
        discount: '-32%',
        badge: 'sale',
        rating: 4,
        reviewsCount: 14,
        frontImage: '/assets/img/fashion-3/product/product-1/product-1.jpg',
        backImage: '/assets/img/fashion-3/product/product-1/product-hover.jpg',
        description: 'Stretch rib cotton racerback tank top cut for a contoured flattering silhouette.',
        sizes: [
            'XS',
            'S',
            'M'
        ],
        colors: [
            {
                name: 'Tangerine',
                hex: '#E65100'
            },
            {
                name: 'Butter',
                hex: '#F9F295'
            }
        ],
        inStock: true,
        isTrending: false,
        tabCategory: 'featured',
        department: 'women'
    },
    {
        id: 'prod-10',
        name: 'Relaxed Vintage Wash Tee',
        category: 'Streetwear',
        price: 1650,
        rating: 5,
        reviewsCount: 21,
        frontImage: '/assets/img/fashion-3/product/product-2/product-1.jpg',
        backImage: '/assets/img/fashion-3/product/product-2/product-hover.jpg',
        description: 'Garment-dyed heavyweight cotton tee featuring dropped shoulders and custom vintage wash.',
        sizes: [
            'S',
            'M',
            'L',
            'XL'
        ],
        colors: [
            {
                name: 'Washed Black',
                hex: '#262626'
            },
            {
                name: 'Forest',
                hex: '#093624'
            }
        ],
        inStock: true,
        isTrending: false,
        tabCategory: 'top_sellers',
        department: 'men'
    },
    {
        id: 'prod-11',
        name: 'Tailored Pleated Trouser',
        category: 'Bottoms',
        price: 4200,
        originalPrice: 5200,
        discount: '-19%',
        badge: 'hot',
        rating: 5,
        reviewsCount: 39,
        frontImage: '/assets/img/fashion-3/product/product-3/product-1.jpg',
        backImage: '/assets/img/fashion-3/product/product-3/product-hover.jpg',
        description: 'Double front pleats with tapered drape and concealed waistband closure.',
        sizes: [
            '30',
            '32',
            '34',
            '36'
        ],
        colors: [
            {
                name: 'Espresso',
                hex: '#3B2F2F'
            },
            {
                name: 'Charcoal',
                hex: '#2C3539'
            }
        ],
        inStock: true,
        isTrending: false,
        tabCategory: 'featured',
        department: 'men'
    },
    {
        id: 'prod-12',
        name: 'Classic Minimalist Leather Tote',
        category: 'Bags & Accessories',
        price: 5800,
        badge: 'new',
        rating: 5,
        reviewsCount: 47,
        frontImage: '/assets/img/bag-collection/bag-1.jpg',
        backImage: '/assets/img/bag-collection/bag-2.jpg',
        description: 'Handcrafted full-grain Italian leather bag with reinforced double straps and magnetic closure.',
        sizes: [
            'One Size'
        ],
        colors: [
            {
                name: 'Cognac',
                hex: '#8B4513'
            },
            {
                name: 'Deep Emerald',
                hex: '#093624'
            },
            {
                name: 'Black',
                hex: '#000000'
            }
        ],
        inStock: true,
        isTrending: false,
        tabCategory: 'top_sellers',
        department: 'women'
    }
];
const CATEGORIES = [
    {
        id: 'cat-1',
        title: 'Tops & Shirts',
        itemCount: '24 Items',
        image: '/assets/img/fashion-2/category/cat-1.jpg',
        link: '/shop'
    },
    {
        id: 'cat-2',
        title: 'Tops Collection',
        itemCount: '18 Items',
        image: '/assets/img/fashion-2/category/cat-2.jpg',
        link: '/shop'
    },
    {
        id: 'cat-3',
        title: 'Casual & Dress',
        itemCount: '35 Items',
        image: '/assets/img/fashion-2/category/cat-3.jpg',
        link: '/shop'
    },
    {
        id: 'cat-4',
        title: 'Fashion Tees',
        itemCount: '42 Items',
        image: '/assets/img/fashion-2/category/cat-4.jpg',
        link: '/shop'
    },
    {
        id: 'cat-5',
        title: 'Stylish Shirts',
        itemCount: '19 Items',
        image: '/assets/img/fashion-2/category/cat-5.jpg',
        link: '/shop'
    },
    {
        id: 'cat-6',
        title: 'Women’s Tops',
        itemCount: '31 Items',
        image: '/assets/img/fashion-2/category/cat-4.jpg',
        link: '/shop'
    }
];
const ARRIVALS_LOOKS = [
    {
        id: 'look-1',
        navThumb: '/assets/img/fashion-2/arrival-product/nav-img-1.jpg',
        title: 'Minimalist Autumn Wool Jacket',
        tag: 'Trending Look #01',
        products: [
            {
                ...PRODUCTS[0],
                price: 3850,
                originalPrice: 4800,
                discount: '-20%'
            },
            {
                ...PRODUCTS[1],
                price: 3600,
                originalPrice: 4500,
                discount: '-20%'
            }
        ]
    },
    {
        id: 'look-2',
        navThumb: '/assets/img/fashion-2/arrival-product/nav-img-2.jpg',
        title: 'Everyday Textured Overshirt Set',
        tag: 'Trending Look #02',
        products: [
            {
                ...PRODUCTS[2],
                price: 2450,
                originalPrice: 3200,
                discount: '-23%'
            },
            {
                ...PRODUCTS[3],
                price: 4950
            }
        ]
    },
    {
        id: 'look-3',
        navThumb: '/assets/img/fashion-2/arrival-product/nav-img-3.jpg',
        title: 'Cozy Alpaca Knit Layering',
        tag: 'Trending Look #03',
        products: [
            {
                ...PRODUCTS[4],
                price: 1950,
                originalPrice: 2800,
                discount: '-30%'
            },
            {
                ...PRODUCTS[5],
                price: 1850
            }
        ]
    },
    {
        id: 'look-4',
        navThumb: '/assets/img/fashion-2/arrival-product/nav-img-4.jpg',
        title: 'Urban Chic Silhouette',
        tag: 'Trending Look #04',
        products: [
            {
                ...PRODUCTS[6],
                price: 2950
            },
            {
                ...PRODUCTS[7],
                price: 1450
            }
        ]
    }
];
const TESTIMONIALS = [
    {
        id: 'test-1',
        quote: '"Reshans brings truly unique international aesthetics right here to Bangladesh. Premium fabrics, fast delivery in Dhaka, and exceptional packaging!"',
        name: 'Alina De Silva',
        role: 'Fashion Model & Influencer',
        rating: 5
    },
    {
        id: 'test-2',
        quote: '"The attention to fabric texture, fast shipping across Bangladesh, and minimalist aesthetics makes Reshans my go-to fashion storefront."',
        name: 'Tanvir Hossain',
        role: 'Creative Director, Dhaka',
        rating: 5
    },
    {
        id: 'test-3',
        quote: '"Exceptional customer care and luxurious packaging. The Alpaca crewneck exceeded expectations—superb craftsmanship that lasts season after season."',
        name: 'Nusrat Jahan',
        role: 'Stylist & Lifestyle Creator',
        rating: 5
    }
];
const SHOPGRAM_IMAGES = [
    '/assets/img/fashion-2/shop-gram/shop-1.jpg',
    '/assets/img/fashion-2/shop-gram/shop-2.jpg',
    '/assets/img/fashion-2/shop-gram/shop-3.jpg',
    '/assets/img/fashion-2/shop-gram/shop-4.jpg',
    '/assets/img/fashion-2/shop-gram/shop-5.jpg',
    '/assets/img/fashion-2/shop-gram/shop-6.jpg',
    '/assets/img/fashion-2/shop-gram/shop-7.jpg'
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_08dkqo-8pkv5k._.js.map