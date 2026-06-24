"use strict";

(() => {
  function sameTarget(left, right) {
    if (!left || !right || left.tabId !== right.tabId) {
      return false;
    }
    if (left.documentId && right.documentId) {
      return left.documentId === right.documentId;
    }
    return left.frameId === right.frameId;
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
        if (activeOwner?.tabId === target.tabId) {
          await setOwner(null);
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
        await setOwner({ ...target });
        return { ok: true, owner: true };
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
        try {
          await command(target, "enter");
        } catch {}
        return { ok: true, owner: true };
      }
      if (
        activeOwner?.tabId === target.tabId &&
        !sameTarget(activeOwner, target) &&
        Number(activeOwner.score || 0) >= Number(target.score || 0)
      ) {
        return { ok: true, owner: false };
      }
      if (activeOwner) {
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
      await setOwner({ ...target });
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
