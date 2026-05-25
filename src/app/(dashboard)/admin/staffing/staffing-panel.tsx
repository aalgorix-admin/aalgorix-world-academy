"use client";

import Link from "next/link";
import { useState } from "react";

import { AssignCourseModal } from "./assign-course-modal";
import { displayRole, type StaffingPageData, type StaffProfile } from "./types";

function formatCreatedDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
    new Date(value),
  );
}

function RoleBadge({ role }: { role: StaffProfile["role"] }) {
  const styles: Record<StaffProfile["role"], string> = {
    admin: "bg-violet-100 text-violet-800 ring-violet-200",
    teacher: "bg-indigo-100 text-indigo-800 ring-indigo-200",
    student: "bg-sky-100 text-sky-800 ring-sky-200",
    parent: "bg-amber-100 text-amber-900 ring-amber-200",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset ${styles[role]}`}
    >
      {displayRole(role)}
    </span>
  );
}

export function StaffingPanel({ data }: { data: StaffingPageData }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<StaffProfile | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const teacherAssignmentCounts = new Map<string, number>();
  for (const row of data.assignments) {
    teacherAssignmentCounts.set(
      row.teacher_id,
      (teacherAssignmentCounts.get(row.teacher_id) ?? 0) + 1,
    );
  }

  function openAllocationModal(profile: StaffProfile) {
    setSelectedTeacher(profile);
    setModalOpen(true);
  }

  return (
    <>
      <Link
        href="/admin"
        className="text-sm font-medium text-indigo-600 transition hover:text-indigo-500"
      >
        ← Admin home
      </Link>

      {banner ? (
        <p
          role="status"
          className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          {banner}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 font-semibold text-slate-700">Full name</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Email</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Role</th>
                <th className="px-4 py-3 font-semibold text-slate-700">Created</th>
                <th className="px-4 py-3 font-semibold text-slate-700">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.profiles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    No profiles registered in this instance yet.
                  </td>
                </tr>
              ) : (
                data.profiles.map((profile) => {
                  const allocationCount = teacherAssignmentCounts.get(profile.id) ?? 0;

                  return (
                    <tr key={profile.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {profile.full_name?.trim() || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{profile.email}</td>
                      <td className="px-4 py-3">
                        <RoleBadge role={profile.role} />
                      </td>
                      <td className="px-4 py-3 tabular-nums text-slate-600">
                        {formatCreatedDate(profile.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => openAllocationModal(profile)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-800 transition hover:bg-indigo-100"
                        >
                          Manage course allocation
                          {profile.role === "teacher" && allocationCount > 0 ? (
                            <span className="rounded-full bg-indigo-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                              {allocationCount}
                            </span>
                          ) : null}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        {data.publishedCourses.length} published course
        {data.publishedCourses.length === 1 ? "" : "s"} available for allocation ·{" "}
        {data.assignments.length} active teacher-course link
        {data.assignments.length === 1 ? "" : "s"}
      </p>

      <AssignCourseModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
        assignments={data.assignments}
        publishedCourses={data.publishedCourses}
        onSuccess={(message) => setBanner(message)}
      />
    </>
  );
}
