import math

CX, CY = 256, 256
GREEN = "#114b2d"
CREAM = "#f4f2ea"

def pt(a_deg, r):
    a = math.radians(a_deg)
    return (CX + r*math.sin(a), CY - r*math.cos(a))   # 0=top, clockwise

def arc(a1, a2, r):
    x1,y1 = pt(a1,r); x2,y2 = pt(a2,r)
    large = 1 if (a2-a1) % 360 > 180 else 0
    return f"M {x1:.1f} {y1:.1f} A {r} {r} 0 {large} 1 {x2:.1f} {y2:.1f}"

R = 150
SW = 30

# TWO arrows forming a clockwise rotation cycle (recycle/refresh symbol).
# Two ~120-deg arcs on the right and left, gaps at top & bottom, an arrowhead
# at the leading (clockwise) end of each. Two arrows reads clearly as "rotation"
# and removes the single-crescent silhouette.
arc1 = arc(30, 150, R)    # right side, top -> bottom
arc2 = arc(210, 330, R)   # left side, bottom -> top

def arrowhead(ae):
    tipx, tipy = pt(ae+12, R)            # tip slightly ahead along the arc
    bx, by     = pt(ae-4,  R+SW*0.95)    # back outer
    ix, iy     = pt(ae-4,  R-SW*0.95)    # back inner
    return f"M {tipx:.1f} {tipy:.1f} L {bx:.1f} {by:.1f} L {ix:.1f} {iy:.1f} Z"

ah1 = arrowhead(150)
ah2 = arrowhead(330)

# --- center bug (cream) ---
body  = f'<ellipse cx="{CX}" cy="285" rx="40" ry="54" fill="{CREAM}"/>'
head  = f'<circle cx="{CX}" cy="226" r="24" fill="{CREAM}"/>'
split = f'<line x1="{CX}" y1="240" x2="{CX}" y2="335" stroke="{GREEN}" stroke-width="7" stroke-linecap="round"/>'
ant   = (f'<path d="M {CX-10} 210 Q {CX-26} 190 {CX-30} 178" stroke="{CREAM}" stroke-width="7" fill="none" stroke-linecap="round"/>'
         f'<path d="M {CX+10} 210 Q {CX+26} 190 {CX+30} 178" stroke="{CREAM}" stroke-width="7" fill="none" stroke-linecap="round"/>')
legs = ""
for ly in (262, 290, 318):
    legs += (f'<line x1="{CX-36}" y1="{ly}" x2="{CX-66}" y2="{ly-10}" stroke="{CREAM}" stroke-width="8" stroke-linecap="round"/>'
             f'<line x1="{CX+36}" y1="{ly}" x2="{CX+66}" y2="{ly-10}" stroke="{CREAM}" stroke-width="8" stroke-linecap="round"/>')

svg = f'''<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="115" fill="{GREEN}"/>
  <path d="{arc1}" fill="none" stroke="{CREAM}" stroke-width="{SW}" stroke-linecap="round"/>
  <path d="{arc2}" fill="none" stroke="{CREAM}" stroke-width="{SW}" stroke-linecap="round"/>
  <path d="{ah1}" fill="{CREAM}"/>
  <path d="{ah2}" fill="{CREAM}"/>
  {legs}
  {ant}
  {body}
  {head}
  {split}
</svg>'''
open("icon.svg","w").write(svg)
print("wrote icon.svg (two-arrow rotation)")
