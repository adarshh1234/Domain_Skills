import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  Square,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Calendar,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code2,
  Laptop,
  Users,
  Shield,
  FileCheck,
  Award
} from 'lucide-react';
import { OnboardingHeader } from '../../components/onboarding/OnboardingHeader';
import { OnboardingStepper } from '../../components/onboarding/OnboardingStepper';
import { onboardingService } from '../../services/onboardingService';
import {
  ChecklistTask,
  CandidateProfile,
  OnboardingProgress
} from '../../types/onboarding';

export const Checklist: React.FC = () => {
  const [candidate, setCandidate] = useState<CandidateProfile | null>(null);
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<ChecklistTask['category']>('Setup');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<ChecklistTask['priority']>('Medium');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cand, prog, list] = await Promise.all([
        onboardingService.getCandidate(),
        onboardingService.getProgress(),
        onboardingService.getChecklist()
      ]);
      setCandidate(cand);
      setProgress(prog);
      setTasks(list);
    } catch (err) {
      console.error('Failed to load checklist', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async (taskId: string) => {
    await onboardingService.toggleTaskCompletion(taskId);
    await loadData();
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    await onboardingService.addTask(
      newTaskTitle,
      newTaskCategory,
      newTaskDesc,
      newTaskPriority,
      '2026-10-15'
    );
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsAddOpen(false);
    await loadData();
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredTasks =
    activeCategory === 'All'
      ? tasks
      : tasks.filter((t) => t.category === activeCategory);

  const getCategoryIcon = (category: ChecklistTask['category']) => {
    switch (category) {
      case 'Setup':
        return <Laptop size={15} color="#60a5fa" />;
      case 'HR & Compliance':
        return <FileCheck size={15} color="#34d399" />;
      case 'Team & Culture':
        return <Users size={15} color="#a78bfa" />;
      case 'Technical Skills':
        return <Code2 size={15} color="#f59e0b" />;
      default:
        return <CheckSquare size={15} color="#94a3b8" />;
    }
  };

  return (
    <div className="main-content">
      <OnboardingHeader candidate={candidate} progress={progress} />
      <OnboardingStepper progress={progress} />

      {/* Progress & Milestone Summary Hero */}
      <div
        className="card"
        style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(14, 22, 42, 0.95) 0%, rgba(20, 28, 52, 0.85) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#93c5fd',
                  border: '1px solid rgba(59, 130, 246, 0.4)'
                }}
              >
                Day-1 Readiness Telemetry
              </span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Kickoff Target: October 15, 2026
              </span>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
              Execution Checklist & Action Items
            </h2>

            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '600px', lineHeight: 1.5 }}>
              Track hardware delivery, SSO account initialization, security compliance training, and first-week milestone objectives.
            </p>
          </div>

          {/* Progress Circular / Counter Widget */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              background: 'rgba(10, 15, 28, 0.8)',
              padding: '1.1rem 1.5rem',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          >
            <div>
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Completed Tasks
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#34d399', lineHeight: 1.2 }}>
                {completedCount} / {totalCount}
              </div>
              <div style={{ fontSize: '0.725rem', color: '#64748b' }}>
                {totalCount - completedCount} tasks remaining
              </div>
            </div>

            <div style={{ width: '80px', height: '80px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="80" height="80" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="3.2"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#gradient-chk)"
                  strokeWidth="3.2"
                  strokeDasharray={`${percentage}, 100`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
                <defs>
                  <linearGradient id="gradient-chk" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: 'absolute', fontSize: '0.9rem', fontWeight: 900, color: '#ffffff' }}>
                {percentage}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar & Category Filters */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['All', 'Setup', 'HR & Compliance', 'Team & Culture', 'Technical Skills', 'Administrative'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.45rem 0.95rem',
                borderRadius: '8px',
                fontSize: '0.775rem',
                fontWeight: 700,
                cursor: 'pointer',
                border: activeCategory === cat ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid transparent',
                background: activeCategory === cat ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: activeCategory === cat ? '#ffffff' : '#94a3b8',
                transition: 'all 0.15s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddOpen(!isAddOpen)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
        >
          <Plus size={14} color="#60a5fa" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Add Task Form Collapsible */}
      {isAddOpen && (
        <form
          onSubmit={handleAddTask}
          className="card animate-fade-in"
          style={{
            marginBottom: '1.5rem',
            background: 'rgba(16, 24, 44, 0.9)',
            border: '1px solid rgba(59, 130, 246, 0.4)'
          }}
        >
          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem' }}>
            Add New Onboarding Action Item
          </h4>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}
          >
            <div className="form-group">
              <label className="form-label">Task Title</label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Schedule GPU Cluster Sandbox orientation"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={newTaskCategory}
                onChange={(e) => setNewTaskCategory(e.target.value as any)}
                className="form-select"
              >
                <option value="Setup">Setup</option>
                <option value="HR & Compliance">HR & Compliance</option>
                <option value="Team & Culture">Team & Culture</option>
                <option value="Technical Skills">Technical Skills</option>
                <option value="Administrative">Administrative</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as any)}
                className="form-select"
              >
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Instructions</label>
            <input
              type="text"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Additional details or links for this task..."
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="btn btn-secondary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.775rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.45rem 1.25rem', fontSize: '0.775rem' }}
            >
              Add Task
            </button>
          </div>
        </form>
      )}

      {/* Task List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="card"
            style={{
              padding: '1.1rem 1.35rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              background: task.isCompleted ? 'rgba(10, 16, 28, 0.6)' : 'rgba(14, 20, 36, 0.85)',
              border: task.isCompleted
                ? '1px solid rgba(16, 185, 129, 0.2)'
                : '1px solid rgba(255, 255, 255, 0.08)',
              opacity: task.isCompleted ? 0.85 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {/* Left: Checkbox & Info */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: '1 1 380px' }}>
              <button
                onClick={() => handleToggle(task.id)}
                aria-label={task.isCompleted ? 'Mark task as pending' : 'Mark task as completed'}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  marginTop: '2px'
                }}
              >
                {task.isCompleted ? (
                  <CheckCircle2 size={22} color="#10b981" />
                ) : (
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      background: 'rgba(255, 255, 255, 0.05)'
                    }}
                  />
                )}
              </button>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      color: task.isCompleted ? '#94a3b8' : '#ffffff',
                      textDecoration: task.isCompleted ? 'line-through' : 'none'
                    }}
                  >
                    {task.title}
                  </span>

                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.675rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1'
                    }}
                  >
                    {getCategoryIcon(task.category)}
                    <span>{task.category}</span>
                  </span>

                  <span
                    style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      color: task.priority === 'High' ? '#fb7185' : task.priority === 'Medium' ? '#fbbf24' : '#93c5fd',
                      background:
                        task.priority === 'High'
                          ? 'rgba(244, 63, 94, 0.12)'
                          : task.priority === 'Medium'
                          ? 'rgba(245, 158, 11, 0.12)'
                          : 'rgba(59, 130, 246, 0.12)'
                    }}
                  >
                    {task.priority} Priority
                  </span>
                </div>

                <p style={{ fontSize: '0.785rem', color: '#94a3b8', lineHeight: 1.45 }}>
                  {task.description}
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', fontSize: '0.7rem', color: '#64748b' }}>
                  <span>Assigned by: {task.assignedBy}</span>
                  <span>Due: {task.dueDate}</span>
                  {task.completedAt && <span style={{ color: '#34d399' }}>Completed: {task.completedAt}</span>}
                </div>
              </div>
            </div>

            {/* Right: Action Button if configured */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {task.actionUrl ? (
                <Link
                  to={task.actionUrl}
                  className="btn btn-secondary"
                  style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem', gap: '0.35rem' }}
                >
                  <span>{task.actionText || 'Open Task'}</span>
                  <ArrowRight size={12} />
                </Link>
              ) : task.actionText ? (
                <span
                  style={{
                    fontSize: '0.725rem',
                    color: '#93c5fd',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                    background: 'rgba(59, 130, 246, 0.1)'
                  }}
                >
                  {task.actionText}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
