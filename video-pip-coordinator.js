"use strict";

(() => {
  function sameTarget(left, right) {
    if (!left || !right || sourceTabId(left) !== sourceTabId(right)) {
      return false;
    }
    if (sourceDocumentId(left) && sourceDocumentId(right)) {
      return sourceDocumentId(left) === sourceDocumentId(right);
    }
    return sourceFrameId(left) === sourceFrameId(right);
  }

  function sourceTabId(target) {
    return Number.isInteger(target?.sourceTabId) ? target.sourceTabId : target?.tabId;
  }

  function sourceFrameId(target) {
    return Number.isInteger(target?.sourceFrameId) ? target.sourceFrameId : (Number.isInteger(target?.frameId) ? target.frameId : 0);
  }

  function sourceDocumentId(target) {
    return target?.sourceDocumentId || target?.documentId || "";
  }

  function sameSourceTab(owner, target) {
    return Number.isInteger(target?.tabId) && sourceTabId(owner) === target.tabId;
  }

  function finiteNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function sessionId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function sessionFromTarget(target, request, previousOwner = null) {
    const now = Date.now();
    const playing = request?.playing === true;
    return {
      ...target,
      sessionId: previousOwner?.sessionId || sessionId(),
      sourceTabId: target.tabId,
      sourceFrameId: sourceFrameId(target),
      sourceDocumentId: sourceDocumentId(target),
      sourceUrl: typeof request?.sourceUrl === "string" && request.sourceUrl ? request.sourceUrl : (target.sourceUrl || previousOwner?.sourceUrl || ""),
      status: "active",
      playing,
      paused: typeof request?.paused === "boolean" ? request.paused : !playing,
      currentTime: Math.max(0, finiteNumber(request?.currentTime, finiteNumber(previousOwner?.currentTime, 0))),
      volume: Math.min(1, Math.max(0, finiteNumber(request?.volume, finiteNumber(previousOwner?.volume, 1)))),
      muted: request?.muted === true,
      createdAt: finiteNumber(previousOwner?.createdAt, now),
      updatedAt: now
    };
  }

  function sourceLostSession(owner, request) {
    return {
      ...owner,
      sourceUrl: typeof request?.sourceUrl === "string" && request.sourceUrl ? request.sourceUrl : (owner?.sourceUrl || ""),
      status: "source-lost",
      playing: false,
      paused: true,
      updatedAt: Date.now()
    };
  }

  function create({ command, loadOwner, saveOwner }) {
    let ownerLoaded = false;
    let owner = null;
    let queue = Promise.resolve();

    async function currentOwner() {
      if (!ownerLoaded) {
        owner = await loadOwner() || null;
        ownerLoaded = true;
      }
      return owner;
    }

    async function setOwner(nextOwner) {
      owner = nextOwner;
      ownerLoaded = true;
      await saveOwner(nextOwner);
    }

    async function exitOwner(activeOwner) {
      try {
        await command(activeOwner, "exit");
      } catch {
        // A closed or navigated document has already released its PiP session.
      }
      await setOwner(null);
    }

    async function process(request, target) {
      const activeOwner = await currentOwner();
      if (request?.type === "removed") {
        if (sameSourceTab(activeOwner, target)) {
          await setOwner(null);
        }
        return { ok: true };
      }
      if (request?.type === "source-lost") {
        if (sameSourceTab(activeOwner, target)) {
          await setOwner(sourceLostSession(activeOwner, request));
        }
        return { ok: true };
      }
      if (request?.type === "left") {
        if (sameTarget(activeOwner, target)) {
          await setOwner(null);
        }
        return { ok: true };
      }
      if (request?.type === "entered") {
        if (!activeOwner || sameSourceTab(activeOwner, target)) {
          await setOwner(sessionFromTarget(target, request, sameTarget(activeOwner, target) ? activeOwner : null));
          return { ok: true, owner: true };
        }
        return { ok: true, owner: false };
      }
      if (request?.type === "exit") {
        if (sameTarget(activeOwner, target)) {
          await exitOwner(activeOwner);
        }
        return { ok: true };
      }
      if (request?.type !== "enter") {
        return { ok: false };
      }
      if (sameTarget(activeOwner, target)) {
        let response;
        try {
          response = await command(target, "enter");
        } catch {}
        if (response?.entered === true) {
          await setOwner(sessionFromTarget(target, request, activeOwner));
        }
        return { ok: true, owner: true };
      }
      if (
        sameSourceTab(activeOwner, target) &&
        activeOwner?.status === "active" &&
        Number(activeOwner.score || 0) >= Number(target.score || 0)
      ) {
        return { ok: true, owner: false };
      }
      if (activeOwner && !sameSourceTab(activeOwner, target)) {
        return { ok: true, owner: false };
      }
      if (activeOwner?.status === "active") {
        await exitOwner(activeOwner);
      }
      let response;
      try {
        response = await command(target, "enter");
      } catch {
        return { ok: false };
      }
      if (response?.entered !== true) {
        return { ok: true, owner: false };
      }
      await setOwner(sessionFromTarget(target, request));
      return { ok: true, owner: true };
    }

    return {
      handle(request, target) {
        const task = queue.then(
          () => process(request, target),
          () => process(request, target)
        );
        queue = task.catch(() => {});
        return task;
      }
    };
  }

  globalThis.WayleafVideoPipCoordinator = Object.freeze({ create });
})();
