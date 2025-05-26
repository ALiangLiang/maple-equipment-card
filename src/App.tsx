import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import textImg from './assets/text.png';

const MapleRingCard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState('閃耀名牌戒指');
  const [subtitle, setSubtitle] = useState('無法交換');
  const [level, setLevel] = useState(70);
  const [neededStr, setNeededStr] = useState(50);
  const [neededDex, setNeededDex] = useState(50);
  const [neededInt, setNeededInt] = useState(50);
  const [neededLuk, setNeededLuk] = useState(50);
  const [str, setStr] = useState(1);
  const [dex, setDex] = useState(1);
  const [int, setInt] = useState(1);
  const [luk, setLuk] = useState(1);
  const [hp, setHp] = useState(150);
  const [mp, setMp] = useState(150);
  const [move, setMove] = useState(5);
  const [jump, setJump] = useState(5);
  const [classAccess, setClassAccess] = useState({
    初心者: true,
    劍士: true,
    法師: true,
    弓箭手: true,
    盜賊: true,
    海盜: true,
  });
  const [category, setCategory] = useState('勳章');
  const [icon, setIcon] = useState<string | null>(null);
  const [background, setBackground] = useState('#fff');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIcon(url);
    }
  };

  const toggleClassAccess = (cls: string) => {
    setClassAccess((prev) => ({ ...prev, [cls]: !prev[cls] }));
  };

  const exportImage = async () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = 'equipment_card.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  useEffect(() => {
    let y = 34;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const borderWidth = 4;
    const cardWidth = 364;
    const cardHeight = 500;
    const cardX = borderWidth
    const cardY = borderWidth;
    canvas.width = cardWidth + borderWidth * 2;
    canvas.height = cardHeight + borderWidth * 2;

    const imgWidth = 103;
    const imgHeight = 104;
    const imgX = 17 + borderWidth;
    const imgY = 80 + borderWidth;

    // 畫邊框
    ctx.fillStyle = 'rgba(65, 81, 108, 0.367)';
    ctx.fillRect(2, 2, cardWidth + 4, 1);
    ctx.fillRect(2, 3, 1, cardHeight + 2);
    ctx.fillRect(borderWidth + cardWidth + 1, 3, 1, cardHeight + 2);
    ctx.fillRect(2, borderWidth + cardHeight + 1, cardWidth + 4, 1);
    ctx.fillStyle = 'rgba(25, 43, 78, 0.6)';
    ctx.fillRect(0, 0, cardWidth + 8, 2);
    ctx.fillRect(0, 2, 2, cardHeight + 4);
    ctx.fillRect(borderWidth + cardWidth + 2, 2, 2, cardHeight + 4);
    ctx.fillRect(0, borderWidth + cardHeight + 2, canvas.width, 2);


    // 畫背景區塊
    ctx.fillRect(cardX, cardY, cardWidth, imgY - borderWidth);
    ctx.fillRect(cardX, imgY, imgX - borderWidth, imgHeight);
    ctx.fillRect(imgX + imgWidth, imgY, cardWidth - 17 - imgWidth, imgHeight);
    ctx.fillRect(cardX, imgY + imgHeight, cardWidth, cardHeight - imgY - imgHeight + borderWidth);

    // 裝備圖片灰底框
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(imgX, imgY, imgWidth, imgHeight);

    // 畫裝備名稱與副標
    ctx.font = '18px "Noto Sans KR"';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(name, canvas.width / 2, y);

    ctx.font = '14px "Noto Sans KR"';
    ctx.fillStyle = '#fd9802';
    ctx.fillText(subtitle, canvas.width / 2, (y += 28));

    // 疊右側圖
    const img = new Image();
    img.src = textImg;
    const imgDy = (y += 18);
    img.onload = () => {
      ctx.drawImage(img, 160, imgDy);
    };

    // 畫所需屬性
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px "Noto Sans KR"';
    ctx.textAlign = 'left';
    ctx.fillText(String(level), 240, 90);
    ctx.fillText(String(neededStr), 240, 110);
    ctx.fillText(String(neededDex), 240, 127);
    ctx.fillText(String(neededInt), 240, 143);
    ctx.fillText(String(neededLuk), 240, 160);

    // 若有上傳圖片，畫於灰底框中央
    if (icon) {
      const iconImg = new Image();
      iconImg.src = icon;
      iconImg.onload = () => {
        const scale = 73 / 29;
        const drawW = iconImg.width * scale;
        const drawH = iconImg.height * scale;
        const offsetX = imgX + (imgWidth - drawW) / 2;
        const offsetY = imgY + (imgHeight - drawH) / 2;
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(iconImg, offsetX, offsetY, drawW, drawH);
      };
    }

    y += 140;

    // 畫職業限制
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px "Noto Sans KR"';
    ctx.textAlign = 'left';
    const classInfos = Object.entries(classAccess).map(([text, can]) => [text, can ? '#fff' : 'red', ctx.measureText(text).width] as const);
    const gapWidth = 13;
    const textWidth = classInfos.reduce((sum, [, , width]) => sum + width, 0);
    const lineWidth = textWidth + gapWidth * 5;
    let offsetX = 0;
    for (const [text, color, width] of classInfos) {
      ctx.fillStyle = color;
      ctx.fillText(text, (canvas.width - lineWidth) / 2 + offsetX, y);
      offsetX += width + gapWidth;
    }

    // 裝備分類
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.beginPath();
    ctx.moveTo(10, (y += 14));
    ctx.lineTo(354, y);
    ctx.stroke();
    ctx.fillText(`裝備分類${category}`, canvas.width / 2, (y += 34));

    // 屬性
    const stats: string[] = [];
    if (str) stats.push(`力量：+${str}`);
    if (dex) stats.push(`敏捷：+${dex}`);
    if (int) stats.push(`智力：+${int}`);
    if (luk) stats.push(`幸運：+${luk}`);
    if (hp) stats.push(`HP：+${hp}`);
    if (mp) stats.push(`MP：+${mp}`);
    if (move) stats.push(`移動速度：+${move}`);
    if (jump) stats.push(`跳躍力：+${jump}`);

    stats.forEach((line) => {
      ctx.fillText(line, canvas.width / 2, (y += 29));
    });
  }, [name, subtitle, level, str, dex, int, luk, hp, mp, move, jump, classAccess, category, icon]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen" style={{ backgroundColor: background }}>
      <canvas ref={canvasRef} />

      <div className="w-full max-w-md flex flex-col gap-2 p-4 bg-gray-900 rounded shadow-md">
        <Input placeholder="裝備名稱" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="副標題" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
        <Input type="number" placeholder="等級" value={level} onChange={(e) => setLevel(parseInt(e.target.value))} />
        <Input type="number" placeholder="需要力量" value={neededStr} onChange={(e) => setNeededStr(parseInt(e.target.value))} />
        <Input type="number" placeholder="需要敏捷" value={neededDex} onChange={(e) => setNeededDex(parseInt(e.target.value))} />
        <Input type="number" placeholder="需要智力" value={neededInt} onChange={(e) => setNeededInt(parseInt(e.target.value))} />
        <Input type="number" placeholder="需要幸運" value={neededLuk} onChange={(e) => setNeededLuk(parseInt(e.target.value))} />
        <div className="grid grid-cols-2 gap-2">
          <Input type="number" placeholder="力量" value={str} onChange={(e) => setStr(parseInt(e.target.value))} />
          <Input type="number" placeholder="敏捷" value={dex} onChange={(e) => setDex(parseInt(e.target.value))} />
          <Input type="number" placeholder="智力" value={int} onChange={(e) => setInt(parseInt(e.target.value))} />
          <Input type="number" placeholder="幸運" value={luk} onChange={(e) => setLuk(parseInt(e.target.value))} />
          <Input type="number" placeholder="HP" value={hp} onChange={(e) => setHp(parseInt(e.target.value))} />
          <Input type="number" placeholder="MP" value={mp} onChange={(e) => setMp(parseInt(e.target.value))} />
          <Input type="number" placeholder="移動速度" value={move} onChange={(e) => setMove(parseInt(e.target.value))} />
          <Input type="number" placeholder="跳躍力" value={jump} onChange={(e) => setJump(parseInt(e.target.value))} />
        </div>
        <div className="flex flex-wrap gap-1">
          {Object.keys(classAccess).map((cls) => (
            <Button
              key={cls}
              variant={classAccess[cls] ? 'default' : 'destructive'}
              onClick={() => toggleClassAccess(cls)}
            >
              {cls}
            </Button>
          ))}
        </div>
        <Input placeholder="裝備分類" value={category} onChange={(e) => setCategory(e.target.value)} />
        <Input type="color" value={background} onChange={(e) => setBackground(e.target.value)} />
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        <Button onClick={exportImage}>匯出圖片</Button>
      </div>
    </div>
  );
};

export default MapleRingCard;
