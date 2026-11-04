
(function () {
    const GAP = 8;
    const PADDING = 8;
    const MAX_COLUMNS = 3;

    function getDropzone(item, dropzones) {
        const rect = item.getBoundingClientRect();

        let bestZone = null;
        let maxArea = 0;

        dropzones.forEach(zone => {
            const zoneRect = zone.getBoundingClientRect();

            const width = Math.max(
                0,
                Math.min(rect.right, zoneRect.right) -
                Math.max(rect.left, zoneRect.left)
            );

            const height = Math.max(
                0,
                Math.min(rect.bottom, zoneRect.bottom) -
                Math.max(rect.top, zoneRect.top)
            );

            const area = width * height;

            if (area > maxArea) {
                maxArea = area;
                bestZone = zone;
            }
        });

        return bestZone;
    }

    function arrangeItems(root) {
        const dropzones = Array.from(
            root.querySelectorAll(':scope > .h5p-dropzone')
        );

        const items = Array.from(
            root.querySelectorAll(
                ':scope > .h5p-draggable.h5p-dropped'
            )
        );

        if (!dropzones.length || !items.length) return;

        const rootRect = root.getBoundingClientRect();

        const groups = new Map();

        dropzones.forEach(zone => {
            groups.set(zone, []);
        });

        items.forEach(item => {
            const zone = getDropzone(item, dropzones);

            if (zone) {
                groups.get(zone).push(item);
            }
        });

        groups.forEach((zoneItems, zone) => {
            if (!zoneItems.length) return;

            const zoneRect = zone.getBoundingClientRect();

            const maxWidth = Math.max(
                ...zoneItems.map(item =>
                    item.getBoundingClientRect().width
                )
            );

            const maxHeight = Math.max(
                ...zoneItems.map(item =>
                    item.getBoundingClientRect().height
                )
            );

            const columns = Math.max(
                1,
                Math.min(
                    MAX_COLUMNS,
                    Math.floor(
                        (zoneRect.width - PADDING * 2 + GAP) /
                        (maxWidth + GAP)
                    )
                )
            );

            zoneItems.forEach((item, index) => {
                const col = index % columns;
                const row = Math.floor(index / columns);

                const left =
                    zoneRect.left - rootRect.left +
                    PADDING + col * (maxWidth + GAP);

                const top =
                    zoneRect.top - rootRect.top +
                    PADDING + row * (maxHeight + GAP);

                item.style.setProperty(
                    'left',
                    `${left}px`,
                    'important'
                );

                item.style.setProperty(
                    'top',
                    `${top}px`,
                    'important'
                );
            });
        });
    }

    function init() {
        const roots = Array.from(
            document.querySelectorAll('.h5p-inner')
        ).filter(root =>
            root.querySelector(':scope > .h5p-dropzone')
        );

        roots.forEach(root => {
            // TEST: BÔI ĐỎ TẤT CẢ DRAGGABLE
            root.querySelectorAll('.h5p-draggable').forEach(item => {
                item.style.setProperty(
                    'border',
                    '3px solid red',
                    'important'
                );
            });

            let timeout;

            function scheduleArrange() {
                clearTimeout(timeout);

                timeout = setTimeout(() => {
                    arrangeItems(root);
                }, 150);
            }

            // Bắt sự kiện sau khi thả
            [
                'pointerup',
                'mouseup',
                'touchend',
                'keyup'
            ].forEach(event => {
                root.addEventListener(
                    event,
                    scheduleArrange,
                    true
                );
            });

            // Theo dõi class thay đổi
            const observer = new MutationObserver(records => {
                const changed = records.some(record =>
                    record.attributeName === 'class'
                );

                if (changed) {
                    scheduleArrange();
                }
            });

            observer.observe(root, {
                subtree: true,
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            init
        );
    } else {
        init();
    }
})();
