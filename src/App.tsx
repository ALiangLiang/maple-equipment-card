import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Radio } from '@/components/ui/radio';
import shadowImg from './assets/shadow.png';
import textImg from './assets/text.png';

function loadImage(
  url: string, 
  ctx: CanvasRenderingContext2D, 
  x: number, 
  y: number,
  width?: number,
  height?: number,
  alpha?: number
): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      ctx.globalAlpha = alpha ?? 1;
      ctx.drawImage(img, x, y, width || img.width, height || img.height);
      ctx.globalAlpha = 1;
      resolve()
    };
  })
}

type ClassKey = '初心者' | '劍士' | '法師' | '弓箭手' | '盜賊' | '海盜';

const MapleRingCard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [name, setName] = useState('巴基特短刃(+7)');
  const [nameColor, setNameColor] = useState('rgb(213, 121, 248)');
  const [subtitle, setSubtitle] = useState('');
  const [level, setLevel] = useState(90);
  const [speed, setSpeed] = useState('快');
  const [neededStr, setNeededStr] = useState(0);
  const [neededDex, setNeededDex] = useState(130);
  const [neededInt, setNeededInt] = useState(0);
  const [neededLuk, setNeededLuk] = useState(230);
  const [str, setStr] = useState(0);
  const [dex, setDex] = useState(0);
  const [int, setInt] = useState(0);
  const [luk, setLuk] = useState(9);
  const [hp, setHp] = useState(0);
  const [mp, setMp] = useState(0);
  const [move, setMove] = useState(0);
  const [jump, setJump] = useState(0);
  const [attack, setAttack] = useState(105);
  const [magicAttack, setMagicAttack] = useState(0);
  const [defense, setDefense] = useState(1);
  const [magicDefense, setMagicDefense] = useState(0);
  const [avoidability, setAvoidability] = useState(3);
  const [classAccess, setClassAccess] = useState<Record<ClassKey, boolean>>({
    初心者: false,
    劍士: false,
    法師: false,
    弓箭手: false,
    盜賊: true,
    海盜: false,
  });
  const [itemType, setItemType] = useState<'裝備' | '武器'>('武器');
  const [category, setCategory] = useState('短劍');
  const [scrollAvailable, setScrollAvailable] = useState(0);
  const [icon, setIcon] = useState<string | null>(null);
  const [background, setBackground] = useState('#ffffff');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIcon(url);
    }
  };

  const toggleClassAccess = (cls: ClassKey) => {
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
    let y = 38;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
    
    const borderWidth = 4;
    const cardWidth = 355;
    const cardX = borderWidth
    const cardY = borderWidth;
    const canvasWidth = cardWidth + borderWidth * 2;
    tempCanvas.width = canvasWidth;
    tempCanvas.height = 500
    const imgWidth = 110;
    const imgHeight = 110;
    const imgX = 18 + borderWidth;
    const imgY = 62 + (subtitle ? 24 : -7) + borderWidth;

    // 畫裝備名稱與副標
    tempCtx.font = '20px "Noto Sans KR"';
    tempCtx.fillStyle = nameColor;
    tempCtx.textAlign = 'center';
    tempCtx.fillText(name, tempCanvas.width / 2, y);

    if (subtitle) {
      tempCtx.font = '16px "Noto Sans KR"';
      tempCtx.fillStyle = '#fd9802';
      tempCtx.fillText(subtitle, tempCanvas.width / 2, (y += 32));
      y += 3
    }

    tempCtx.imageSmoothingEnabled = false;
    const promises =[
      // 疊物品陰影
      loadImage(shadowImg, tempCtx, 41, y + 100, 72, 16, 0.5), // 畫裝備名稱陰影
      // 疊右側圖
      loadImage(textImg, tempCtx, 152, y += 10) // 畫裝備名稱
    ]

    // 畫所需屬性
    tempCtx.fillStyle = '#ffffff';
    tempCtx.font = '200 14px "微軟正黑體"';
    tempCtx.textAlign = 'left';
    tempCtx.fillText(String(level), 240, y += 14);
    tempCtx.fillText(String(neededStr), 240, y += 19);
    tempCtx.fillText(String(neededDex), 240, y += 17);
    tempCtx.fillText(String(neededInt), 240, y += 17);
    tempCtx.fillText(String(neededLuk), 240, y += 19);
    tempCtx.fillStyle = '#fd9802';
    tempCtx.fillText('-', 240, y += 15);
    tempCtx.fillText('-', 252, y += 19);

    // 若有上傳圖片，畫於灰底框中央
    if (icon) {
      promises.push(new Promise<void>((resolve) => {
        const iconImg = new Image();
        iconImg.src = icon;
        iconImg.onload = () => {
          const scale = 73 / 29;
          const drawW = iconImg.width * scale;
          const drawH = iconImg.height * scale;
          const offsetX = imgX + (imgWidth - drawW) / 2;
          const offsetY = imgY + (imgHeight - drawH) / 2;
          tempCtx.imageSmoothingEnabled = false;
          tempCtx.drawImage(iconImg, offsetX, offsetY, drawW, drawH);
          resolve()
        }
      }))
    }

    y += 30;

    // 畫職業限制
    tempCtx.fillStyle = '#000000';
    tempCtx.font = '18px "Noto Sans KR"';
    tempCtx.textAlign = 'left';
    const classInfos = Object.entries(classAccess).map(([text, can]) => [text, can ? '#ffffff' : 'rgb(202, 37, 38)', tempCtx.measureText(text).width] as const);
    const gapWidth = 16;
    const textWidth = classInfos.reduce((sum, [, , width]) => sum + width, 0);
    const lineWidth = textWidth + gapWidth * 5;
    tempCtx.font = '22px "Noto Sans KR"';
    let offsetX = 0;
    for (const [text, color, width] of classInfos) {
      tempCtx.fillStyle = color;
      tempCtx.fillText(text, (tempCanvas.width - lineWidth) / 2 + offsetX, y);
      offsetX += width + gapWidth;
    }

    // 畫分隔線
    tempCtx.fillStyle = '#ffffff';
    tempCtx.lineWidth = 1
    tempCtx.beginPath();
    y += 11
    tempCtx.moveTo(10 + borderWidth, y);
    tempCtx.lineTo(canvasWidth - borderWidth - 10, y);
    
    tempCtx.font = '300 22px "Noto Sans KR"';

    // 裝備分類
    tempCtx.strokeStyle = '#ffffff';
    tempCtx.stroke()
    tempCtx.textAlign = 'center';
    tempCtx.fillText(`${itemType}分類${category}`, tempCanvas.width / 2, (y += 34));

    y += 1

    // 屬性
    const stats: string[] = [];
    if (speed) stats.push(`攻擊速度：${speed}`);
    if (str) stats.push(`力量：+${str}`);
    if (dex) stats.push(`敏捷：+${dex}`);
    if (int) stats.push(`智力：+${int}`);
    if (luk) stats.push(`幸運：+${luk}`);
    if (hp) stats.push(`HP：+${hp}`);
    if (mp) stats.push(`MP：+${mp}`);
    if (move) stats.push(`移動速度：+${move}`);
    if (jump) stats.push(`跳躍力：+${jump}`);
    if (attack) stats.push(`攻擊力：+${attack}`);
    if (magicAttack) stats.push(`魔法攻擊力：+${magicAttack}`);
    if (defense) stats.push(`防禦力：+${defense}`);
    if (magicDefense) stats.push(`魔法防禦力：+${magicDefense}`);
    if (avoidability) stats.push(`迴避率：+${avoidability}`);
    if (scrollAvailable) stats.push(`可使用卷軸數：${scrollAvailable}`);

    stats.forEach((line) => {
      tempCtx.fillText(line, tempCanvas.width / 2, (y += 30));
    });

    y += 6
    
    const cardHeight = y;

    canvas.width = canvasWidth;
    canvas.height = y + borderWidth * 2;

    // 裝備圖片灰底框
    ctx.fillStyle = 'rgba(168, 176, 188, 0.8)';
    ctx.fillRect(imgX, imgY, imgWidth, imgHeight);
    
    // 畫背景區塊
    ctx.fillStyle = 'rgba(25, 43, 78, 0.6)';
    ctx.fillRect(cardX, cardY, cardWidth, imgY - borderWidth);
    ctx.fillRect(cardX, imgY, imgX - borderWidth, imgHeight);
    ctx.fillRect(imgX + imgWidth, imgY, cardWidth - 18 - imgWidth, imgHeight);
    ctx.fillRect(cardX, imgY + imgHeight, cardWidth, cardHeight - imgY - imgHeight + borderWidth);
    
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
    
    Promise.all(promises).then(() => {
      ctx.drawImage(tempCanvas, 0, 0);
    })
  }, [name, nameColor, subtitle, level, speed, str, dex, int, luk, hp, mp, move, jump, attack, magicAttack, defense, magicDefense, avoidability, classAccess, category, itemType, icon, neededStr, neededDex, neededInt, neededLuk, scrollAvailable]);

  return (
    <div className="flex flex-col items-center gap-4 p-4 min-h-screen" style={{ backgroundColor: background }}>
      <canvas ref={canvasRef} />

      <div className="w-full max-w-md flex flex-col gap-2 p-4 bg-gray-900 rounded shadow-md">
        <label>裝備名稱</label>
        <Input placeholder="裝備名稱" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
        <div className="flex gap-2">
          <span>名稱顏色：</span>
          <Button onClick={() => setNameColor('#ffffff')}>白色</Button>
          <Button onClick={() => setNameColor('rgb(255, 179, 0)')}>橘色</Button>
          <Button onClick={() => setNameColor('rgb(70, 151, 247)')}>藍色</Button>
          <Button onClick={() => setNameColor('rgb(213, 121, 248)')}>紫色</Button>
        </div>
        <label>副標題</label>
        <Input placeholder="無法交換" value={subtitle} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubtitle(e.target.value)} />
        <label>等級</label>
        <Input type="number" placeholder="等級" value={level} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLevel(parseInt(e.target.value))} />
        <label>需要力量</label>
        <Input type="number" placeholder="需要力量" value={neededStr} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNeededStr(parseInt(e.target.value))} />
        <label>需要敏捷</label>
        <Input type="number" placeholder="需要敏捷" value={neededDex} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNeededDex(parseInt(e.target.value))} />
        <label>需要智力</label>
        <Input type="number" placeholder="需要智力" value={neededInt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNeededInt(parseInt(e.target.value))} />
        <label>需要幸運</label>
        <Input type="number" placeholder="需要幸運" value={neededLuk} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNeededLuk(parseInt(e.target.value))} />
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label>攻擊速度</label>
            <Input placeholder="快" value={speed} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSpeed(e.target.value)} />
          </div>
          <div>
            <label>力量</label>
            <Input type="number" placeholder="力量" value={str} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStr(parseInt(e.target.value))} />
          </div>
          <div>
            <label>敏捷</label>
            <Input type="number" placeholder="敏捷" value={dex} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDex(parseInt(e.target.value))} />
          </div>
          <div>
            <label>智力</label>
            <Input type="number" placeholder="智力" value={int} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInt(parseInt(e.target.value))} />
          </div>
          <div>
            <label>幸運</label>
            <Input type="number" placeholder="幸運" value={luk} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLuk(parseInt(e.target.value))} />
          </div>
          <div>
            <label>HP</label>
            <Input type="number" placeholder="HP" value={hp} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHp(parseInt(e.target.value))} />
          </div>
          <div>
            <label>MP</label>
            <Input type="number" placeholder="MP" value={mp} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMp(parseInt(e.target.value))} />
          </div>
          <div>
            <label>移動速度</label>
            <Input type="number" placeholder="移動速度" value={move} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMove(parseInt(e.target.value))} />
          </div>
          <div>
            <label>跳躍力</label>
            <Input type="number" placeholder="跳躍力" value={jump} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setJump(parseInt(e.target.value))} />
          </div>
          <div>
            <label>攻擊力</label>
            <Input type="number" placeholder="攻擊力" value={attack} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAttack(parseInt(e.target.value))} />
          </div>
          <div>
            <label>魔法攻擊力</label>
            <Input type="number" placeholder="魔法攻擊力" value={magicAttack} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMagicAttack(parseInt(e.target.value))} />
          </div>
          <div>
            <label>防禦力</label>
            <Input type="number" placeholder="防禦力" value={defense} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDefense(parseInt(e.target.value))} />
          </div>
          <div>
            <label>魔法防禦力</label>
            <Input type="number" placeholder="魔法防禦力" value={magicDefense} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMagicDefense(parseInt(e.target.value))} />
          </div>
          <div>
            <label>迴避率</label>
            <Input type="number" placeholder="迴避率" value={avoidability} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvoidability(parseInt(e.target.value))} />
          </div>
          <div>
            <label>可使用卷軸數</label>
            <Input type="number" placeholder="可使用卷軸數" value={scrollAvailable} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setScrollAvailable(parseInt(e.target.value))} />
          </div>
        </div>
        <div>
          {(Object.keys(classAccess) as ClassKey[]).map((cls) => (
            <Button
              key={cls}
              variant={classAccess[cls] ? 'default' : 'destructive'}
              onClick={() => toggleClassAccess(cls)}
            >
              {cls}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <span>裝備類型：</span>
          <Radio
            name="itemType"
            value="裝備"
            checked={itemType === '裝備'}
            onChange={() => setItemType('裝備')}
            label="裝備"
          />
          <Radio
            name="itemType"
            value="武器"
            checked={itemType === '武器'}
            onChange={() => setItemType('武器')}
            label="武器"
          />
        </div>
        <label>裝備分類</label>
        <Input placeholder="裝備分類" value={category} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)} />
        <label>預覽背景顏色</label>
        <Input type="color" value={background} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBackground(e.target.value)} />
        <label>裝備圖示</label>
        <Input type="file" accept="image/*" onChange={handleImageUpload} />
        <Button onClick={exportImage}>匯出圖片</Button>
      </div>
    </div>
  );
};

export default MapleRingCard;
