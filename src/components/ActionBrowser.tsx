import React, { useEffect, useMemo, useState } from 'react';
import {iconBase} from "../model-operations";
import Providers from "../providers";
import {Action} from "../definitions";
import { DatasetIndex } from "@visuallyjs/browser-ui";

interface ActionBrowserProps {
    onClose: () => void;
    onSelect: (item: any, context: any) => void;
    context: any;
}

const ActionBrowser: React.FC<ActionBrowserProps> = ({ onClose, onSelect, context }) => {
    const [providers, setProviders] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const isTrigger = context?.action === 'set-trigger';
    const dataUrl = isTrigger ? '/triggers.json' : '/actions.json';
    const itemsKey = isTrigger ? 'triggers' : 'actions';

    const index = useMemo(() => new DatasetIndex({
        fields: ['name', 'desc', 'provider']
    }), []);

    useEffect(() => {
        fetch(dataUrl)
            .then(response => response.json())
            .then(data => {
                // Ensure each provider has an icon if not present in the json
                const enrichedData = data.map((p: any) => {
                    if (!p.icon) {
                        const providerInfo = Providers.find(pr => pr.id === p.provider);
                        return { ...p, icon: providerInfo?.icon };
                    }
                    p.actions.forEach((a:any) => a.provider = p.provider)
                    return p;
                });
                setProviders(enrichedData);

                index.clear();
                enrichedData.forEach((p: any) => {
                    index.addAll(...p[itemsKey]);
                });
            })
            .catch(error => console.error('Error loading data:', error));
    }, [dataUrl, index, itemsKey]);

    const matchingIds = useMemo(() => {
        if (!searchTerm) return null;
        const hits = index.search(searchTerm);
        return new Set(hits.map(h => h.document.id));
    }, [searchTerm, index]);

    const handleItemClick = (item: any, provider: any) => {
        if (onSelect) {
            onSelect({ ...item, provider: provider.provider, providerIcon: provider.icon }, context);
        }
    };

    const title = context?.title || (isTrigger ? 'Select a Trigger' : 'Select an Action');

    const excludedActionIds = new Set((context?.excludedActions || []).map((a: Action) => a.id));

    return (
        <div className="action-browser">
            <div className="action-browser-header">
                <div className="action-browser-header-title">
                    <h3>{title}</h3>
                    <input type="text" placeholder="search" value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="action-browser-search"
                    />
                </div>
                <button className="close-button" onClick={onClose}>
                    <img src="/icons/close.svg" width="24" height="24" alt="Close" />
                </button>
            </div>
            <div className="action-browser-content">
                {providers.map(provider => {
                    const filteredItems = provider[itemsKey].filter((item: any) => !matchingIds || matchingIds.has(item.id));
                    if (filteredItems.length === 0) return null;

                    return (
                        <div key={provider.provider} className="provider-section">
                            <div className="provider-header">
                                <div className="provider-header-icon-container">
                                    <img src={`${iconBase}/${provider.icon}`} alt={provider.provider} className="provider-header-icon" onError={(e:any) => e.target.style.display='none'} />
                                </div>
                                <h2 className="provider-name">{provider.provider}</h2>
                            </div>
                            <div className="actions-grid">
                                {filteredItems.map((item: any) => {
                                    const isExcluded = excludedActionIds.has(item.id);
                                    return (
                                        <div key={item.id}
                                             className={`action-card ${isExcluded ? 'action-card-disabled' : ''}`}
                                             style={isExcluded ? { opacity: 0.5, pointerEvents: 'none', filter: 'grayscale(100%)' } : {}}
                                             onClick={() => !isExcluded && handleItemClick(item, provider)}>
                                            <div className="action-card-left">
                                                <img src={`${iconBase}/${provider.icon}`} alt={provider.provider} className="action-card-icon" onError={(e:any) => e.target.style.display='none'} />
                                            </div>
                                            <div className="action-card-content">
                                                <div className="action-card-name">{item.name}</div>
                                                <div className="action-card-desc">{item.desc}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ActionBrowser;
