import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { formatResponse } from 'src/common/utils/response.util';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: createReviewDto,
    });
    return formatResponse('Review created successfully', review);
  }

  async findAll() {
    const reviews = await this.prisma.review.findMany();
    return formatResponse('All reviews retrieved successfully', reviews);
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return formatResponse('Review retrieved successfully', review);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    const { doctorId, patientId, ...rest } = updateReviewDto;

    const updatedReview = await this.prisma.review.update({
      where: { id },
      data: rest,
    });
    return formatResponse('Review updated successfully', updatedReview);
  }

  async remove(id: string) {
    await this.prisma.review.delete({
      where: { id },
    });
    return formatResponse('Review deleted successfully', null);
  }
}
