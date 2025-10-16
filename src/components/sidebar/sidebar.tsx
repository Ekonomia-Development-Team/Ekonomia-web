


import React from "react";
import Link from "next/link";
import { FaHome, FaMoneyBillWave, FaChartBar, FaSignInAlt, FaUserPlus, FaReceipt, FaUserCircle } from "react-icons/fa";
import styles from "./sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.profile}>
        <FaUserCircle size={64} className="mb-4 text-blue-300 animate-pulse" />
        <h2 className="text-xl font-bold">JOHN DON</h2>
        <span className="text-sm text-blue-200">john@company.com</span>
      </div>
      <nav className={styles.menu}>
        <ul className={styles.menuList}>
          <li>
            <Link href="/home" className={styles.menuItem}>
              <FaHome />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link href="/dash" className={styles.menuItem}>
              <FaChartBar />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/expenses" className={styles.menuItem}>
              <FaMoneyBillWave />
              <span>Gastos</span>
            </Link>
          </li>
          <li>
            <Link href="/income" className={styles.menuItem}>
              <FaMoneyBillWave />
              <span>Receitas</span>
            </Link>
          </li>
          <li>
            <Link href="/reports" className={styles.menuItem}>
              <FaReceipt />
              <span>Relatórios</span>
            </Link>
          </li>
          <li>
            <Link href="/login" className={styles.menuItem}>
              <FaSignInAlt />
              <span>Login</span>
            </Link>
          </li>
          <li>
            <Link href="/register" className={styles.menuItem}>
              <FaUserPlus />
              <span>Registrar</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
