"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getAllAssignments,
  getAllUsers,
  createAssignment,
  deleteAssignment,
  updateAssignment,
  getSubmissionStats,
} from "../lib/data_store";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

function AdminDashboard() {
  const { user, logout } = useAuth();
  const [assignments, setAssignments] = useState(() => getAllAssignments());
  const [students] = useState(() => getAllUsers().filter((u) => u.role === "student"));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [sortBy, setSortBy] = useState("dueDate");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    driveLink: "",
  });

  const handleAddAssignment = () => {
    if (formData.title && formData.dueDate) {
      if (editingId) {
        updateAssignment(editingId, formData);
        setEditingId(null);
      } else {
        createAssignment({
          ...formData,
          createdBy: user?.id || "",
        });
      }
      setFormData({ title: "", description: "", dueDate: "", driveLink: "" });
      setShowForm(false);
      setAssignments(getAllAssignments());
    }
  };

  const handleEdit = (assignment) => {
    setFormData({
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      driveLink: assignment.driveLink,
    });
    setEditingId(assignment.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    deleteAssignment(id);
    setAssignments(getAllAssignments());
  };

  const sortedAssignments = [...assignments].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    } else {
      const statsA = getSubmissionStats(a.id);
      const statsB = getSubmissionStats(b.id);
      const rateA = statsA.total > 0 ? statsA.submitted / statsA.total : 0;
      const rateB = statsB.total > 0 ? statsB.submitted / statsB.total : 0;
      return rateB - rateA;
    }
  });

  const totalStats = {
    assignments: assignments.length,
    students: students.length,
    totalSubmissions: assignments.reduce(
      (sum, a) => sum + getSubmissionStats(a.id).submitted,
      0
    ),
    totalPossible: assignments.length * students.length,
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Assignment Manager</h1>
            <p className="text-sm text-muted-foreground">
              Admin Dashboard - {user?.name}
            </p>
          </div>
          <Button onClick={logout} variant="outline">
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Assignments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.assignments}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.students}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.totalSubmissions}/{totalStats.totalPossible}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Submission Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalStats.totalPossible > 0
                  ? Math.round(
                      (totalStats.totalSubmissions / totalStats.totalPossible) *
                        100
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Button onClick={() => setShowForm(true)} className="sm:w-auto">
            Create Assignment
          </Button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
          >
            <option value="dueDate">Sort by Due Date</option>
            <option value="submissionRate">Sort by Submission Rate</option>
          </select>
        </div>

        {showForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                {editingId ? "Edit Assignment" : "Create New Assignment"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground mt-1"
                  placeholder="Assignment title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground mt-1"
                  placeholder="Assignment description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Drive Link</label>
                  <input
                    type="url"
                    value={formData.driveLink}
                    onChange={(e) =>
                      setFormData({ ...formData, driveLink: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground mt-1"
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddAssignment} className="flex-1">
                  {editingId ? "Update" : "Create"}
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    setFormData({
                      title: "",
                      description: "",
                      dueDate: "",
                      driveLink: "",
                    });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Assignments</h2>
          {sortedAssignments.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                No assignments yet
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedAssignments.map((assignment) => {
                const stats = getSubmissionStats(assignment.id);
                const submissionRate =
                  stats.total > 0
                    ? Math.round((stats.submitted / stats.total) * 100)
                    : 0;
                return (
                  <Card
                    key={assignment.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="truncate">
                            {assignment.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {assignment.description}
                          </CardDescription>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            onClick={() => handleEdit(assignment)}
                            variant="outline"
                            size="sm"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(assignment.id)}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Due Date</p>
                          <p className="font-medium">
                            {new Date(
                              assignment.dueDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Submitted</p>
                          <p className="font-medium">
                            {stats.submitted}/{stats.total}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Late</p>
                          <p className="font-medium text-orange-600">
                            {stats.late}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">
                            Submission Rate
                          </p>
                          <p className="font-medium">{submissionRate}%</p>
                        </div>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${submissionRate}%` }}
                        />
                      </div>
                      {assignment.driveLink && (
                        <a
                          href={assignment.driveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          View on Google Drive
                        </a>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
