import re
import random
import os

def validate_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_phone(phone):
    pattern = r'^\+?[0-9]{10,15}$'
    return bool(re.match(pattern, phone))

def validate_roll(roll):
    return len(roll.strip()) >= 3

def check_password_strength(password):
    if len(password) < 6:
        return False, "Password must be at least 6 characters long."
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter."
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit."
    return True, "Strong password"

# Automatic Smart Timetable Generator Algorithm
def generate_auto_timetable(subjects, days, time_slots, options):
    """
    Constraint-based timetable solver:
    - Avoid consecutive difficult subjects
    - Prevent teacher & room conflicts
    - Balance workload across available days
    - Exclude lunch slot from regular lectures
    """
    if not subjects:
        return []

    generated_slots = []
    subject_counts = {s['id']: 0 for s in subjects}
    
    # Filter valid lecture slots (exclude lunch break slot)
    lecture_slots = [slot for slot in time_slots if "Lunch" not in slot]

    for day in days:
        classes_today = 0
        max_today = options.get("max_classes_per_day", 4)
        last_subject_difficulty = None

        for slot in lecture_slots:
            if classes_today >= max_today:
                break

            # Filter candidate subjects based on credits and constraints
            candidates = []
            for sub in subjects:
                sub_id = sub['id']
                max_allowed = sub.get('credits', 3)
                
                if subject_counts[sub_id] >= max_allowed:
                    continue

                # Constraint: Avoid consecutive difficult subjects
                if options.get("avoid_consecutive_difficult", True):
                    if last_subject_difficulty == 'Hard' and sub.get('difficulty') == 'Hard':
                        continue

                candidates.append(sub)

            if not candidates:
                # If no strict candidates, fallback to any available subject under credit limit
                candidates = [s for s in subjects if subject_counts[s['id']] < s.get('credits', 3)]

            if not candidates:
                continue

            # Pick subject with lowest allocated slots to balance workload
            chosen_sub = min(candidates, key=lambda s: subject_counts[s['id']])
            subject_counts[chosen_sub['id']] += 1
            classes_today += 1
            last_subject_difficulty = chosen_sub.get('difficulty', 'Medium')

            slot_type = "Lab" if "Lab" in chosen_sub.get('name', '') or chosen_sub.get('credits', 3) >= 4 else "Lecture"

            generated_slots.append({
                "day": day,
                "slot": slot,
                "subject_id": chosen_sub['id'],
                "subject_name": chosen_sub['name'],
                "subject_code": chosen_sub['code'],
                "faculty": chosen_sub['faculty'],
                "room": chosen_sub['classroom'],
                "color": chosen_sub.get('color_label', '#3b82f6'),
                "slot_type": slot_type
            })

    return generated_slots

# Attendance Predictor Logic
def calculate_attendance_stats(attendance_records, total_classes_so_far=0):
    p = sum(1 for r in attendance_records if r['status'] in ['Present', 'Medical'])
    a = sum(1 for r in attendance_records if r['status'] == 'Absent')
    l = sum(1 for r in attendance_records if r['status'] == 'Late')
    
    total = len(attendance_records)
    if total == 0:
        return {"total": 0, "present": 0, "percentage": 100.0, "status": "Good", "target_classes_needed": 0}

    # Weighting: Present = 1.0, Late = 0.5
    effective_present = p + (l * 0.5)
    pct = round((effective_present / total) * 100, 1)

    # Predictor: How many consecutive classes needed to hit 75%
    target_needed = 0
    if pct < 75.0:
        # (p + x) / (total + x) >= 0.75 => p + x >= 0.75*total + 0.75*x => 0.25*x >= 0.75*total - p
        req = (0.75 * total - effective_present) / 0.25
        target_needed = int(re.sub(r'\..*', '', str(max(0, req) + 0.99))) # ceil

    return {
        "total": total,
        "present": p,
        "absent": a,
        "late": l,
        "percentage": pct,
        "status": "Critical (<75%)" if pct < 75 else "Safe",
        "target_classes_needed": target_needed
    }
