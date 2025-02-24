"use client";

import { useState } from "react";
import { useDrawer } from "../Controller/DrawerController";

const styles = {
  drawer: {
    position: 'fixed' as const,
    right: 0,
    top: 0,
    height: '100%',
    width: '320px',
    minWidth: '320px',
    backgroundColor: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    zIndex: 40,
  },
  header: {
    padding: '16px 24px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '18px',
    fontWeight: 500,
    color: '#333',
  },
  closeButton: {
    color: '#9ca3af',
    cursor: 'pointer',
    padding: '4px',
  },
  closeIcon: {
    height: '24px',
    width: '24px',
  },
  content: {
    padding: '16px 24px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 500,
    color: '#333',
    marginBottom: '4px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'white',
    color: '#333',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
    backgroundColor: 'white',
    color: '#333',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px',
  },
  option: {
    backgroundColor: 'white',
    color: '#333',
  },
  footer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    padding: '16px 24px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: 'white',
  },
  submitButton: (disabled: boolean) => ({
    width: '100%',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    color: 'white',
    backgroundColor: disabled ? '#60a5fa' : '#2563eb',
    borderRadius: '6px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    ':hover': {
      backgroundColor: disabled ? '#60a5fa' : '#1d4ed8',
    },
  }),
};

type NodeType = "model" | "data" | "type";

interface FormData {
  name: string;
  type: NodeType;
  direction: "inside" | "outside";
  label: string;
}

export function AddNodeDrawer() {
  const { drawerState, closeDrawer } = useDrawer();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    type: "model",
    direction: "inside",
    label: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const nodeData = {
        id: `node-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        direction: formData.direction,
        label: formData.label,
        parentId: drawerState.rootId!,
      };

      const response = await fetch('/api/node/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nodeData),
      });

      if (!response.ok) {
        throw new Error('Failed to add node');
      }

      setFormData({
        name: "",
        type: "model",
        direction: "inside",
        label: "",
      });
      closeDrawer();
    } catch (error) {
      console.error('Error adding node:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!drawerState.isOpen) return null;

  return (
    <div style={styles.drawer}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.headerTitle}>Add New Node</h3>
        <button onClick={closeDrawer} style={styles.closeButton}>
          <svg
            style={styles.closeIcon}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div>
          {/* Name Input */}
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                name: e.target.value 
              }))}
              style={styles.input}
            />
          </div>

          {/* Type Select */}
          <div style={styles.formGroup}>
            <label htmlFor="type" style={styles.label}>
              Type
            </label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                type: e.target.value as NodeType
              }))}
              style={styles.select as React.CSSProperties}
            >
              <option value="model" style={styles.option}>Model</option>
              <option value="data" style={styles.option}>Data</option>
              <option value="type" style={styles.option}>Type</option>
            </select>
          </div>

          {/* Direction Select */}
          <div style={styles.formGroup}>
            <label htmlFor="direction" style={styles.label}>
              Direction
            </label>
            <select
              id="direction"
              value={formData.direction}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                direction: e.target.value as "inside" | "outside" 
              }))}
              style={styles.select as React.CSSProperties}
            >
              <option value="inside" style={styles.option}>Inside</option>
              <option value="outside" style={styles.option}>Outside</option>
            </select>
          </div>

          {/* Label Input */}
          <div style={styles.formGroup}>
            <label htmlFor="label" style={styles.label}>
              Label
            </label>
            <input
              id="label"
              type="text"
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                label: e.target.value 
              }))}
              style={styles.input}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !formData.name || !formData.label}
          style={styles.submitButton(isLoading || !formData.name || !formData.label)}
        >
          {isLoading ? "Adding..." : "Add Node"}
        </button>
      </div>
    </div>
  );
} 