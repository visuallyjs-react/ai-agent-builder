
interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
                <div className="action-browser-header">
                    <h3>{title}</h3>
                    <button className="close-button" onClick={onCancel}>
                        <img src="/icons/close.svg" width="20" height="20" alt="Close" />
                    </button>
                </div>
                <div className="action-browser-content" style={{ padding: '24px' }}>
                    <p style={{ margin: 0, fontSize: '15px', color: '#4b5563', lineHeight: '1.5' }}>
                        {message}
                    </p>
                </div>
                <div className="vjs-inspector-footer" style={{ gap: '12px' }}>
                    <button className="vjs-ai-button vjs-ai-cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="vjs-ai-button vjs-ai-danger-button"
                        onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}
